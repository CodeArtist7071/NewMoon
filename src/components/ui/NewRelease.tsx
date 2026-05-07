import React, { useEffect, useState } from 'react'
import {
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../stores'
import { NEW_DAYS } from '../../constants/variables'
import { SongCard } from './SongCard'


interface Song {
  Id: string
  Name: string
  Album?: string
  DateCreated: string
  AlbumId?: string
  Artists?: string[]
  ImageTags?: {
    Primary?: string
  }
}

const NewReleases = () => {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  const { serverUrl, token, userid } = useSelector(
    (state: RootState) => state.auth,
  )

  useEffect(() => {
    fetchNewReleases()
  }, [])

  const fetchNewReleases = async () => {
    try {
      const response = await fetch(
        `${serverUrl}/Users/${userid}/Items?` +
          `IncludeItemTypes=Audio&` +
          `Recursive=true&` +
          `SortBy=DateCreated&` +
          `SortOrder=Descending&` +
          `Fields=DateCreated`,
        {
          headers: {
            'X-Emby-Token': token!,
          },
        },
      )

      const data = await response.json()
      const now = new Date()

      const filtered = data.Items.filter((item: Song) => {
        const created = new Date(item.DateCreated)
        const diffDays =
          (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)

        return diffDays <= NEW_DAYS
      })

      setSongs(filtered)
    } catch (err) {
      console.log('Error fetching new releases:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePress = async (selectedSong: Song) => {
    if (!serverUrl || !token) return
    // await playQueue(songs, selectedSong, serverUrl, token)
  }

  const renderItem = ({ item }: { item: Song }) => {
    const imageUrl = item.ImageTags?.Primary
      ? `${serverUrl}/Items/${item.Id}/Images/Primary?maxWidth=200&api_key=${token}`
      : require('../../assets/img/music_vibe.png')

    return (
      <SongCard
        imageUrl={imageUrl}
        onClick={() => handlePress(item)}
        item={item}
      />
    )
  }

  if (loading) {
    return <ActivityIndicator size="large" />
  }

  return (
    <>
      <Text style={styles.header}>New Releases</Text>
      <ScrollView style={styles.container}>
        <FlatList
          data={songs}
          keyExtractor={item => item.Id}
          renderItem={renderItem}
        />
      </ScrollView>
    </>
  )
}

export default NewReleases

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, height: 400 },
  header: {
    fontSize: 22,
    marginLeft: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
})
