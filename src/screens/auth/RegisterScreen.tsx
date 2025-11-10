import React from 'react'
import * as ReactNative from 'react-native'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../store/authSlice'
import * as SecureStore from 'expo-secure-store'
import { register, login } from '../../api/auth'
const { View, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } =
    ReactNative
import { useForm, Controller } from 'react-hook-form'
import * as RNP from 'react-native-paper'
const { TextInput, Button, HelperText, useTheme } = RNP
import * as I18N from 'react-i18next'
const { useTranslation } = I18N

const WARM_BG_CLASS = 'bg-bumbeez-bg-light'
const PRIMARY_TEXT_CLASS = 'text-bumbeez-primary'

const RegisterScreen = ({ navigation }) => {
    const paperTheme = useTheme()
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (data: {
        email: string
        password: string
        firstname: string
        lastname: string
    }) => {
        const registerResponse = await register(
            data.email,
            data.password,
            data.firstname,
            data.lastname,
        )

        const loginResponse = await login(data.email, data.password)
        console.log('Login response after register:', loginResponse)
        await SecureStore.setItemAsync('refreshToken', loginResponse.refreshToken)
        dispatch(
            setCredentials({
                accessToken: loginResponse.accessToken,
                user: loginResponse.user,
            }),
        )
    }

    const passwordValue = watch('password')

    return (
        <SafeAreaView className={`flex-1 ${WARM_BG_CLASS} dark:bg-gray-900`}>
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    className="p-6"
                >
                    <View className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl space-y-3">
                        <View className="items-center mb-6">
                            <Text
                                className={`text-5xl font-extrabold tracking-tight ${PRIMARY_TEXT_CLASS}`}
                            >
                                Bumbeez
                            </Text>
                            <Text className="text-gray-500 mt-2 text-base">
                                {t('auth.create_account')}
                            </Text>
                        </View>
                        <Controller
                            control={control}
                            name="firstname"
                            rules={{ required: t('validation.required_firstname') }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-2">
                                    <TextInput
                                        label={t('auth.firstname')}
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        mode="outlined"
                                        autoCapitalize="words"
                                        outlineColor={
                                            errors.firstname
                                                ? 'red'
                                                : paperTheme.colors.bumbeezInputBorder || '#E0E0E0'
                                        }
                                        className="bg-white dark:bg-gray-800"
                                        left={<RNP.TextInput.Icon icon="account-outline" />}
                                    />
                                    <HelperText type="error" visible={!!errors.firstname}>
                                        {errors.firstname?.message}
                                    </HelperText>
                                </View>
                            )}
                        />
                        <Controller
                            control={control}
                            name="lastname"
                            rules={{ required: t('validation.required_lastname') }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-2">
                                    <TextInput
                                        label={t('auth.lastname')}
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        mode="outlined"
                                        autoCapitalize="words"
                                        outlineColor={
                                            errors.lastname
                                                ? 'red'
                                                : paperTheme.colors.bumbeezInputBorder || '#E0E0E0'
                                        }
                                        className="bg-white dark:bg-gray-800"
                                        left={<RNP.TextInput.Icon icon="account-outline" />}
                                    />
                                    <HelperText type="error" visible={!!errors.lastname}>
                                        {errors.lastname?.message}
                                    </HelperText>
                                </View>
                            )}
                        />
                        <Controller
                            control={control}
                            name="email"
                            rules={{
                                required: t('validation.required_email'),
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: t('validation.invalid_email'),
                                },
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-2">
                                    <TextInput
                                        label={t('auth.email')}
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        mode="outlined"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        outlineColor={
                                            errors.email
                                                ? 'red'
                                                : paperTheme.colors.bumbeezInputBorder || '#E0E0E0'
                                        }
                                        className="bg-white dark:bg-gray-800"
                                        left={<RNP.TextInput.Icon icon="email-outline" />}
                                    />
                                    <HelperText type="error" visible={!!errors.email}>
                                        {errors.email?.message}
                                    </HelperText>
                                </View>
                            )}
                        />
                        <Controller
                            control={control}
                            name="password"
                            rules={{
                                required: t('validation.required_password'),
                                minLength: {
                                    value: 6,
                                    message: t('validation.minlength_password'),
                                },
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-2">
                                    <TextInput
                                        label={t('auth.password')}
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        mode="outlined"
                                        secureTextEntry
                                        outlineColor={
                                            errors.password
                                                ? 'red'
                                                : paperTheme.colors.bumbeezInputBorder || '#E0E0E0'
                                        }
                                        className="bg-white dark:bg-gray-800"
                                        right={<RNP.TextInput.Icon icon="eye" />}
                                        left={<RNP.TextInput.Icon icon="lock-outline" />}
                                    />
                                    <HelperText type="error" visible={!!errors.password}>
                                        {errors.password?.message}
                                    </HelperText>
                                </View>
                            )}
                        />
                        <Controller
                            control={control}
                            name="confirmPassword"
                            rules={{
                                required: t('validation.required_password'),
                                validate: (value) =>
                                    value === passwordValue || t('validation.password_mismatch'),
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View>
                                    <TextInput
                                        label={t('auth.confirm_password')}
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        mode="outlined"
                                        secureTextEntry
                                        outlineColor={
                                            errors.confirmPassword
                                                ? 'red'
                                                : paperTheme.colors.bumbeezInputBorder || '#E0E0E0'
                                        }
                                        className="bg-white dark:bg-gray-800"
                                        right={<RNP.TextInput.Icon icon="eye" />}
                                        left={<RNP.TextInput.Icon icon="lock-check-outline" />}
                                    />
                                    <HelperText type="error" visible={!!errors.confirmPassword}>
                                        {errors.confirmPassword?.message}
                                    </HelperText>
                                </View>
                            )}
                        />
                        <RNP.Button
                            mode="contained"
                            onPress={handleSubmit(onSubmit)}
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
                            className="py-2 rounded-2xl shadow-lg mt-4"
                        >
                            {t('auth.register')}
                        </RNP.Button>

                        {/* --- Option de Connexion --- */}
                        <View className="flex-row justify-center mt-6">
                            <Text className="text-gray-600 dark:text-gray-400">
                                {t('auth.has_account')}{' '}
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text className={`font-bold ${PRIMARY_TEXT_CLASS}`}>
                                    {t('auth.login')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default RegisterScreen
