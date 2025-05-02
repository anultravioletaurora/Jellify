import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { ListTemplate } from 'react-native-carplay'
import uuid from 'react-native-uuid'

const ArtistsTemplate = (items: BaseItemDto[]) =>
	new ListTemplate({
		id: uuid.v4(),
		sections: [
			{
				items:
					items?.map((item) => {
						return {
							id: item.Id!,
							text: item.Name ?? 'Untitled',
						}
					}) ?? [],
			},
		],
		onItemSelect: async (item) => {},
	})

export default ArtistsTemplate
