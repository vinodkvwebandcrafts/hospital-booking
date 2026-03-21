import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { COLORS, FONT_SIZES, SPACING } from '@/config/constants';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = 'Enter a valid email';
    if (!password) next.password = 'Password is required';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please try again.';
      Alert.alert('Login Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>+</Text>
        <Text style={styles.title}>Hospital Booking</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      <Input
        label="Email"
        placeholder="doctor@hospital.com"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Input
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry
      />

      <Button
        title="Sign In"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING['2xl'],
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  logo: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  button: {
    marginTop: SPACING.sm,
  },
});
