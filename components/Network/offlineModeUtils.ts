import { MMKV } from "react-native-mmkv";


import RNFS from 'react-native-fs';
import { JellifyTrack } from "@/types/JellifyTrack";
import { getLibraryApi } from "@jellyfin/sdk/lib/utils/api";
import Client from "../../api/client";
import { Buffer } from 'buffer'
import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import { queryClient } from "@/constants/query-client";

export type JellifyDownload = JellifyTrack & {
   savedAt: string,
   isAutoDownloaded: boolean,
}
export async function downloadJellyfinFile(url: string, name: string,songName:string,queryClient: QueryClient) {
	try {
		// Fetch the file
		const headRes = await axios.head(url)
		const contentType = headRes.headers['content-type']
		console.log('Content-Type:', contentType)

		// Step 2: Get extension from content-type
		let extension = 'mp3' // default
		if (contentType && contentType.includes('/')) {
			const parts = contentType.split('/')
			extension = parts[1].split(';')[0] // handles "audio/m4a; charset=utf-8"
		}

		// Step 3: Build path
		const fileName = `${name}.${extension}`
		const downloadDest = `${RNFS.DocumentDirectoryPath}/${fileName}`

        queryClient.setQueryData(['downloads'], (prev: any = {}) => ({
			...prev,
			[url]: { progress: 0, name: fileName , songName: songName},
		}))


		// Step 4: Start download with progress
		const options = {
			fromUrl: url,
			toFile: downloadDest,
			begin: (res: any) => {
				console.log('Download started')
			},
			progress: (data: any) => {
				const percent = +(data.bytesWritten / data.contentLength).toFixed(2)
				queryClient.setQueryData(['downloads'], (prev: any = {}) => ({
					...prev,
					[url]: { progress: percent, name: fileName , songName: songName},
				}))
			},
			background: true,
			progressDivider: 1,
		}

		const result = await RNFS.downloadFile(options).promise
		console.log('Download complete:', result)
		return `file://${downloadDest}`
	} catch (error) {
		console.error('Download failed:', error);
		throw error;
	}
}




const mmkv  = new MMKV({
    id: "offlineMode",
    encryptionKey: "offlineMode",
})

const MMKV_OFFLINE_MODE_KEYS={
    "AUDIO_CACHE": "audioCache",
}



export const saveAudio = async (track:JellifyTrack,queryClient: QueryClient,isAutoDownloaded: boolean=true) => {
    const existingRaw = mmkv.getString(MMKV_OFFLINE_MODE_KEYS.AUDIO_CACHE)
    let existingArray: JellifyDownload[] = []
    try{
        if(existingRaw){
            existingArray = JSON.parse(existingRaw)
        }
    }catch(error){
        //Ignore
    }
    try{    
        console.log("Downloading audio", track)
        
        const downloadtrack = await downloadJellyfinFile(track.url, track.item.Id as string,track.title as string,queryClient);
        const dowloadalbum = await downloadJellyfinFile(track.artwork as string, track.item.Id as string,track.title as string,queryClient);
        console.log("downloadtrack", downloadtrack)
        if(downloadtrack){
            track.url = downloadtrack;
            track.artwork= dowloadalbum;
        }
    }catch(error){
        console.error(error)
    }
   
    


  

    const index = existingArray.findIndex((t) => t.item.Id === track.item.Id)
  
    if (index >= 0) {
      // Replace existing
      existingArray[index] = {...track,savedAt:new Date().toISOString(),isAutoDownloaded}
    } else {
      // Add new
      existingArray.push({...track,savedAt:new Date().toISOString(),isAutoDownloaded})
    }
    mmkv.set(MMKV_OFFLINE_MODE_KEYS.AUDIO_CACHE, JSON.stringify(existingArray))
    
}



export const getAudioCache =  ():   JellifyDownload[] => {
    const existingRaw = mmkv.getString(MMKV_OFFLINE_MODE_KEYS.AUDIO_CACHE)
    let existingArray: JellifyDownload[] = []
    try{
        if(existingRaw){
            existingArray = JSON.parse(existingRaw)
        }
    }catch(error){
        //Ignore
    }
    return existingArray;
}



export const deleteAudioCache = async () => {
  
    mmkv.delete(MMKV_OFFLINE_MODE_KEYS.AUDIO_CACHE)
}





const AUDIO_CACHE_LIMIT = 20 // change as needed

export const purneAudioCache = async () => {
    const existingRaw = mmkv.getString(MMKV_OFFLINE_MODE_KEYS.AUDIO_CACHE)
    if (!existingRaw) return
  
    let existingArray: JellifyDownload[] = []
  
    try {
      existingArray = JSON.parse(existingRaw)
    } catch (e) {
      return
    }
  
    const autoDownloads = existingArray
      .filter(item => item.isAutoDownloaded)
      .sort((a, b) => new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime()) // oldest first
  
    const excess = autoDownloads.length - AUDIO_CACHE_LIMIT
    if (excess <= 0) return
  
    // Remove the oldest `excess` files
    const itemsToDelete = autoDownloads.slice(0, excess)
    for (const item of itemsToDelete) {
      // Delete audio file
      if (item.url && await RNFS.exists(item.url)) {
        await RNFS.unlink(item.url).catch(() => {})
      }
  
      // Delete artwork
      if (item.artwork && await RNFS.exists(item.artwork)) {
        await RNFS.unlink(item.artwork).catch(() => {})
      }
  
      // Remove from the existingArray
      existingArray = existingArray.filter(i => i.item.Id !== item.item.Id)
    }
  
    mmkv.set(MMKV_OFFLINE_MODE_KEYS.AUDIO_CACHE, JSON.stringify(existingArray))
  }