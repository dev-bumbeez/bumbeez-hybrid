import React, { useState } from "react"
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native"

import { useForm, Controller } from "react-hook-form"
import { TextInput, Button, HelperText, useTheme } from "react-native-paper"

import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { setCredentials } from "../../store/authSlice"

import * as SecureStore from "expo-secure-store"
import { register as apiRegister, login as apiLogin } from "../../api/auth"

import Animated, { FadeInDown } from "react-native-reanimated"

const RegisterScreen = ({ navigation }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { t } = useTranslation()

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [apiError, setApiError] = useState("")

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const passwordValue = watch("password")

    const onSubmit = async (data) => {
        setApiError("")

        try {
            const { firstname, lastname, email, password } = data
            await apiRegister(firstname, lastname, email, password)
            const loginResponse = await apiLogin(email, password)
            const { accessToken, refreshToken, user } = loginResponse
            await SecureStore.setItemAsync("refreshToken", refreshToken)
            dispatch(setCredentials({ accessToken, user }))
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                t("errors.unknown_error")

            setApiError(
                Array.isArray(msg) ? msg[0] : msg
            )
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-bumbeez-bg-light dark:bg-gray-900">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
                    className="px-6"
                >
                    <Animated.View
                        entering={FadeInDown.duration(600).springify()}
                        className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl space-y-5"
                    >
                        {/* Header */}
                        <View className="items-center mb-4">
                            <Text className="text-5xl font-extrabold text-bumbeez-primary">
                                Bumbeez
                            </Text>
                            <Text className="text-gray-500 mt-1">
                                {t("auth.create_account")}
                            </Text>
                        </View>

                        {/* API error */}
                        {apiError !== "" && (
                            <Text className="text-red-500 text-center mb-2 text-sm">
                                {apiError}
                            </Text>
                        )}

                        {/* Firstname */}
                        <Controller
                            control={control}
                            name="firstname"
                            rules={{ required: t("validation.required_firstname") }}
                            render={({ field }) => (
                                <>
                                    <TextInput
                                        label={t("auth.firstname")}
                                        mode="outlined"
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onChangeText={field.onChange}
                                        left={<TextInput.Icon icon="account" />}
                                        outlineColor={errors.firstname ? "red" : "#ddd"}
                                        className="bg-white dark:bg-gray-800"
                                    />
                                    <HelperText type="error" visible={!!errors.firstname}>
                                        {errors.firstname?.message}
                                    </HelperText>
                                </>
                            )}
                        />

                        {/* Lastname */}
                        <Controller
                            control={control}
                            name="lastname"
                            rules={{ required: t("validation.required_lastname") }}
                            render={({ field }) => (
                                <>
                                    <TextInput
                                        label={t("auth.lastname")}
                                        mode="outlined"
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onChangeText={field.onChange}
                                        left={<TextInput.Icon icon="account-outline" />}
                                        outlineColor={errors.lastname ? "red" : "#ddd"}
                                        className="bg-white dark:bg-gray-800"
                                    />
                                    <HelperText type="error" visible={!!errors.lastname}>
                                        {errors.lastname?.message}
                                    </HelperText>
                                </>
                            )}
                        />

                        {/* Email */}
                        <Controller
                            control={control}
                            name="email"
                            rules={{
                                required: t("validation.required_email"),
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: t("validation.invalid_email"),
                                },
                            }}
                            render={({ field }) => (
                                <>
                                    <TextInput
                                        label={t("auth.email")}
                                        mode="outlined"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onChangeText={field.onChange}
                                        left={<TextInput.Icon icon="email-outline" />}
                                        outlineColor={errors.email ? "red" : "#ddd"}
                                        className="bg-white dark:bg-gray-800"
                                    />
                                    <HelperText type="error" visible={!!errors.email}>
                                        {errors.email?.message}
                                    </HelperText>
                                </>
                            )}
                        />

                        {/* Password */}
                        <Controller
                            control={control}
                            name="password"
                            rules={{
                                required: t("validation.required_password"),
                                minLength: { value: 6, message: t("validation.minlength_password") },
                            }}
                            render={({ field }) => (
                                <>
                                    <TextInput
                                        label={t("auth.password")}
                                        mode="outlined"
                                        secureTextEntry={!showPassword}
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onChangeText={field.onChange}
                                        left={<TextInput.Icon icon="lock-outline" />}
                                        right={
                                            <TextInput.Icon
                                                icon={showPassword ? "eye-off" : "eye"}
                                                onPress={() => setShowPassword(!showPassword)}
                                            />
                                        }
                                        outlineColor={errors.password ? "red" : "#ddd"}
                                        className="bg-white dark:bg-gray-800"
                                    />
                                    <HelperText type="error" visible={!!errors.password}>
                                        {errors.password?.message}
                                    </HelperText>
                                </>
                            )}
                        />

                        {/* Confirm password */}
                        <Controller
                            control={control}
                            name="confirmPassword"
                            rules={{
                                required: t("validation.required_password"),
                                validate: (v) =>
                                    v === passwordValue || t("validation.password_mismatch"),
                            }}
                            render={({ field }) => (
                                <>
                                    <TextInput
                                        label={t("auth.confirm_password")}
                                        mode="outlined"
                                        secureTextEntry={!showConfirmPassword}
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onChangeText={field.onChange}
                                        left={<TextInput.Icon icon="lock-check-outline" />}
                                        right={
                                            <TextInput.Icon
                                                icon={showConfirmPassword ? "eye-off" : "eye"}
                                                onPress={() =>
                                                    setShowConfirmPassword(!showConfirmPassword)
                                                }
                                            />
                                        }
                                        outlineColor={errors.confirmPassword ? "red" : "#ddd"}
                                        className="bg-white dark:bg-gray-800"
                                    />
                                    <HelperText type="error" visible={!!errors.confirmPassword}>
                                        {errors.confirmPassword?.message}
                                    </HelperText>
                                </>
                            )}
                        />

                        {/* Register Button */}
                        <Button
                            mode="contained"
                            onPress={handleSubmit(onSubmit)}
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            className="py-2 rounded-xl bg-bumbeez-primary"
                            labelStyle={{ fontSize: 18, fontWeight: "bold" }}
                        >
                            {t("auth.register")}
                        </Button>

                        {/* Link */}
                        <View className="flex-row justify-center mt-3">
                            <Text className="text-gray-600 dark:text-gray-400">
                                {t("auth.has_account")}{" "}
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                <Text className="font-bold text-bumbeez-primary">
                                    {t("auth.login")}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default RegisterScreen
