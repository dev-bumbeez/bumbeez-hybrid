import React from 'react';
import * as ReactNative from 'react-native';
const { View, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } = ReactNative;

import { useForm, Controller } from 'react-hook-form';
import * as RNP from 'react-native-paper';
const { TextInput, Button, HelperText, useTheme } = RNP;

import * as I18N from 'react-i18next';
const { useTranslation } = I18N;

const WARM_BG_CLASS = "bg-bumbeez-bg-light"; 
const PRIMARY_TEXT_CLASS = "text-bumbeez-primary";

const LoginScreen = ({ navigation }) => {
  const paperTheme = useTheme(); 
  const { t } = useTranslation();
  
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { 
      email: '', 
      password: '',
    },
  });

  const onSubmit = (data) => {
    console.log("Connexion en cours avec:", data);
  };

  return (
    <SafeAreaView className={`flex-1 ${WARM_BG_CLASS} dark:bg-gray-900`}> 
      <KeyboardAvoidingView 
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="p-6">
          
          <View className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl space-y-4"> 
            <View className="items-center mb-6">
              <Text className={`text-5xl font-extrabold tracking-tight ${PRIMARY_TEXT_CLASS}`}> 
                Bumbeez
              </Text>
              <Text className="text-gray-500 mt-2 text-base">
                {t('auth.connect_to_continue')} {/* <-- Texte traduit */}
              </Text>
            </View>
            <Controller
              control={control}
              name="email"
              rules={{
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
                    outlineColor={errors.email ? 'red' : paperTheme.colors.bumbeezInputBorder || '#E0E0E0'} 
                    className="bg-white dark:bg-gray-800"
                    left={<TextInput.Icon icon="email-outline" />}
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
                } 
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    label={t('auth.password')}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    mode="outlined"
                    secureTextEntry
                    outlineColor={errors.password ? 'red' : paperTheme.colors.bumbeezInputBorder || '#E0E0E0'} 
                    className="bg-white dark:bg-gray-800"
                    right={<TextInput.Icon icon="eye" />}
                    left={<TextInput.Icon icon="lock-outline" />}
                  />
                  <HelperText type="error" visible={!!errors.password}>
                    {errors.password?.message}
                  </HelperText>
                </View>
              )}
            />
            <TouchableOpacity onPress={() => console.log('Mot de passe oublié')} className="items-end mt-0 mb-4">
              <Text className={`text-sm font-semibold ${PRIMARY_TEXT_CLASS}`}>
                {t('auth.forgot_password')}
              </Text>
            </TouchableOpacity>
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
              labelStyle={{ fontSize: 18, fontWeight: 'bold' }} 
              className="py-2 rounded-2xl shadow-lg" 
            >
              {t('auth.connect')}
            </Button>
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600 dark:text-gray-400">
                {t('auth.no_account')}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')} className="ml-2">
                <Text className={`font-bold ${PRIMARY_TEXT_CLASS}`}>
                  {t('auth.signup')}
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;