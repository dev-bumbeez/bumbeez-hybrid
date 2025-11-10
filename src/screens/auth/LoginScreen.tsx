import React from "react";
import { View, Text } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextInput, Button } from "react-native-paper";
import { loginApi } from "../../api/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginScreen({ navigation }: any) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await loginApi(data.email, data.password);
      console.log("Login success", res);
      // stocker accessToken + refreshToken ici (SecureStore)
    } catch (err) {
      console.log("Login error", err);
    }
  };

  return (
    <View className="flex-1 justify-center p-4 bg-gray-100">
      <Text className="text-3xl font-bold text-center mb-6">Login</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Email"
            value={value}
            onChangeText={onChange}
            className="mb-4"
            mode="outlined"
            error={!!errors.email}
          />
        )}
      />
      {errors.email && <Text className="text-red-500 mb-2">{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Password"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            className="mb-4"
            mode="outlined"
            error={!!errors.password}
          />
        )}
      />
      {errors.password && <Text className="text-red-500 mb-2">{errors.password.message}</Text>}

      <Button mode="contained" onPress={handleSubmit(onSubmit)} className="mt-4">
        Login
      </Button>

      <Button onPress={() => navigation.navigate("Register")} className="mt-4">
        Go to Register
      </Button>
    </View>
  );
}
