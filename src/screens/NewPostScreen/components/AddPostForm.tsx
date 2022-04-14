import { Button, TextInput } from 'components'
import { useFormik } from 'formik'
import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { Image, StyleSheet, View } from 'react-native'
import * as yup from 'yup'
import { useNavigation } from '@react-navigation/native'
import { NavigationProps, db } from 'config'
import validUrl from 'valid-url'
import { useUser } from 'providers'
import moment from 'moment'

const PLACEHOLDER_IMG =
  'https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc='

interface AddPostState {
  caption: string
  imageUrl: string
}

export const AddPostForm = () => {
  const { userAuth, userInfo } = useUser()

  const uploadPost = (v: AddPostState) => {
    const { imageUrl, caption } = v
    db.collection('users')
      .doc(userAuth?.uid)
      .collection('posts')
      .add({
        userId: userAuth?.uid,
        imageUrl,
        caption,
        profileImageUrl: userInfo?.profilePicture,
        likes: 0,
        commentsCount: 0,
        likesByUsers: [],
        username: userInfo?.username,
        createdAt: moment().toISOString(),
      })
      .then(() => navigation.goBack())
  }

  const navigation = useNavigation<NavigationProps>()
  const intl = useIntl()

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      caption: yup
        .string()
        .max(2000, intl.formatMessage({ id: 'messages.maxLength' }, { length: 2000 }))
        .required(intl.formatMessage({ id: 'messages.required' })),
      imageUrl: yup
        .string()
        .url()
        .required(intl.formatMessage({ id: 'messages.required' })),
    })
  }, [intl])

  const [initialValues] = useState({
    caption: '',
    imageUrl: '',
  })

  const { values, errors, touched, handleSubmit, handleBlur, handleChange, isValid } = useFormik<AddPostState>({
    initialValues,
    validationSchema,
    validateOnMount: true,
    onSubmit: async (v) => {
      uploadPost(v)
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image
          style={styles.image}
          source={{ uri: validUrl.isUri(values.imageUrl) ? values.imageUrl : PLACEHOLDER_IMG }}
        />
        <TextInput
          style={[styles.textInput, { marginRight: 110 }]}
          placeholder="Enter image URL..."
          placeholderTextColor={'gray'}
          value={values.imageUrl}
          onChangeText={handleChange('imageUrl')}
          onBlur={handleBlur('imageUrl')}
          error={errors.imageUrl}
          touched={touched.imageUrl}
        />
      </View>
      <TextInput
        style={styles.textInput}
        placeholder="Describe your post..."
        placeholderTextColor={'gray'}
        multiline
        value={values.caption}
        onChangeText={handleChange('caption')}
        onBlur={handleBlur('caption')}
        error={errors.caption}
        touched={touched.caption}
        maxLength={1000}
      />
      <Button style={styles.button} title="Share" onPress={() => handleSubmit()} disabled={!isValid} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 120,
    marginRight: 12,
  },
  textInput: {
    fontSize: 18,
    color: '#fff',
  },
  button: {
    marginTop: 12,
  },
})
