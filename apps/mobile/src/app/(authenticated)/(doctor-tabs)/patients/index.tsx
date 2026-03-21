import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import LoadingScreen from '@/components/common/LoadingScreen';
import EmptyState from '@/components/common/EmptyState';
import { getPatients } from '@/services/api/doctors';
import { COLORS, FONT_SIZES, SPACING } from '@/config/constants';
import type { User } from '@/types';

export default function PatientsListScreen() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['patients', search],
    queryFn: () => getPatients({ search: search || undefined }),
  });

  const patients = data?.data ?? [];

  const renderPatient = ({ item }: { item: User }) => (
    <Pressable
      onPress={() =>
        router.push(`/(authenticated)/(doctor-tabs)/patients/${item.id}` as never)
      }
    >
      <Card style={styles.card}>
        <View style={styles.row}>
          <Avatar firstName={item.firstName} lastName={item.lastName} size={44} />
          <View style={styles.info}>
            <Text style={styles.name}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={styles.meta}>{item.phone}</Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Patients</Text>
      <View style={styles.searchWrap}>
        <Input
          placeholder="Search patients..."
          value={search}
          onChangeText={setSearch}
          containerStyle={styles.searchInput}
        />
      </View>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id}
          renderItem={renderPatient}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState title="No Patients" message="No patients found." />
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
  meta: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
});
