import { PostItem } from 'components'
import { usePosts } from 'hooks'
import { View } from 'react-native'
import { Divider } from 'react-native-elements/dist/divider/Divider'

export const Posts = () => {
  const posts = usePosts()

  return (
    <View>
      <Divider width={1} orientation={'vertical'} />
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </View>
  )
}
