import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import LoadingScreen from '@/components/common/LoadingScreen';
import EmptyState from '@/components/common/EmptyState';
import { getDoctors } from '@/services/api/doctors';
import { COLORS, FONT_SIZES, SPACING } from '@/config/constants';
import type { Doctor } from '@/types';

export default function AdminDoctorsListScreen() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['doctors', search],
    queryFn: () => getDoctors({ search: search || undefined }),
  });

  const doctors = data?.data ?? [];

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <Pressable
      onPress={() =>
        router.push(`/(authenticated)/(admin-tabs)/doctors/${item.id}` as never)
      }
    >
      <Card style={styles.card}>
        <View style={styles.row}>
          <Avatar
            firstName={item.user?.firstName}
            lastName={item.user?.lastName}
            size={48}
          />
          <View style={styles.info}>
            <Text style={styles.name}>
              Dr. {item.user?.firstName} {item.user?.lastName}
            </Text>
            <Text style={styles.specialty}>{item.specialization}</Text>
          </View>
          <Badge
            label={item.isAvailable ? 'Active' : 'Inactive'}
            variant={item.isAvailable ? 'success' : 'danger'}
          />
        </View>
      </Card>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Doctors</Text>
      <View style={styles.searchWrap}>
        <Input
          placeholder="Search doctors..."
          value={search}
          onChangeText={setSearch}
          containerStyle={styles.searchInput}
        />
      </View>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          renderItem={renderDoctor}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState title="No Doctors" message="No doctors found." />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '800',
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  searchWrap: { paddingHorizontal: SPACING.lg },
  searchInput: { marginBottom: SPACING.sm },
  list: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING['3xl'] },
  card: { marginBottom: SPACING.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { marginLeft: SPACING.md, flex: 1 },
  name: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.textPrimary },
  specialty: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
});
