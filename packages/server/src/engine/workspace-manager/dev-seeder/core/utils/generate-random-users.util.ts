export type RandomUserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  canImpersonate: boolean;
  canAccessFullAdminPanel: boolean;
  isEmailVerified: boolean;
};

export type RandomUserWorkspaceData = {
  id: string;
  userId: string;
  workspaceId: string;
};

export type RandomWorkspaceMemberData = {
  id: string;
  nameFirstName: string;
  nameLastName: string;
  locale: string;
  colorScheme: string;
  userEmail: string;
  userId: string;
};

// Daftar nama yang terasa natural untuk warga desa Indonesia
const FIRST_NAMES = [
  'Budi',
  'Siti',
  'Ahmad',
  'Dewi',
  'Eko',
  'Rina',
  'Agus',
  'Sri',
  'Joko',
  'Ani',
  'Bambang',
  'Wati',
  'Hadi',
  'Yuni',
  'Andi',
  'Lestari',
  'Dedi',
  'Indah',
  'Rudi',
  'Maya',
  'Hendra',
  'Putri',
  'Wahyu',
  'Ratna',
  'Slamet',
  'Fitri',
  'Surya',
  'Nurul',
  'Iwan',
  'Sari',
  'Teguh',
  'Endang',
  'Bayu',
  'Lina',
  'Dwi',
  'Tuti',
  'Arif',
  'Mega',
  'Yusuf',
  'Rahma',
  'Faisal',
  'Diah',
  'Gunawan',
  'Ayu',
  'Hari',
  'Wulan',
  'Irfan',
  'Novi',
  'Rizki',
  'Citra',
  'Dani',
  'Intan',
  'Fajar',
  'Vina',
  'Rohman',
  'Mira',
  'Adi',
  'Tari',
  'Cahyo',
  'Yanti',
  'Nugroho',
  'Heni',
  'Anwar',
  'Desi',
  'Hidayat',
  'Murni',
  'Setiawan',
  'Reni',
  'Pranoto',
  'Astuti',
  'Sulaiman',
  'Kartini',
  'Maulana',
  'Hartati',
  'Ramadhan',
  'Suryani',
  'Kurnia',
  'Wahyuni',
  'Saputra',
  'Anggraini',
  'Firman',
  'Melati',
  'Hartono',
  'Ningsih',
  'Purnama',
  'Susanti',
  'Bagus',
  'Komariah',
  'Sutrisno',
  'Rahayu',
  'Darmawan',
  'Sumiati',
  'Wibisono',
  'Larasati',
  'Prabowo',
  'Mawar',
  'Suherman',
  'Yuliana',
  'Taufik',
  'Nabila',
];

const LAST_NAMES = [
  'Santoso',
  'Wijaya',
  'Pratama',
  'Susanto',
  'Nugraha',
  'Hidayat',
  'Setiawan',
  'Saputra',
  'Kusuma',
  'Lestari',
  'Permana',
  'Wibowo',
  'Cahyono',
  'Hartono',
  'Suryanto',
  'Gunawan',
  'Maulana',
  'Firmansyah',
  'Halim',
  'Iskandar',
  'Purnomo',
  'Hakim',
  'Sutanto',
  'Ramadhan',
  'Yulianto',
  'Prasetyo',
  'Mahendra',
  'Anggara',
  'Sucipto',
  'Wardhana',
  'Rahmawati',
  'Handayani',
  'Kurniawan',
  'Sahputra',
  'Siregar',
  'Nasution',
  'Harahap',
  'Simanjuntak',
  'Sinaga',
  'Tanjung',
  'Hutapea',
  'Manurung',
  'Sitompul',
  'Ginting',
  'Sembiring',
  'Tarigan',
  'Lubis',
  'Pohan',
  'Batubara',
  'Damanik',
  'Marpaung',
  'Sirait',
  'Panjaitan',
  'Silalahi',
  'Hutabarat',
  'Napitupulu',
  'Tampubolon',
  'Aritonang',
  'Simbolon',
  'Mardani',
  'Suryadi',
  'Winata',
  'Putra',
  'Pakpahan',
  'Situmorang',
  'Hutasoit',
  'Sihombing',
  'Nainggolan',
  'Purba',
  'Saragih',
  'Manalu',
  'Banjarnahor',
  'Gultom',
  'Pasaribu',
  'Sidabutar',
  'Lumbantobing',
  'Sianturi',
  'Hasibuan',
  'Dalimunthe',
  'Pulungan',
];

const COLOR_SCHEMES = ['Light', 'Dark', 'System'];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;

  return x - Math.floor(x);
}

export function generateRandomUsers(): {
  users: RandomUserData[];
  userWorkspaces: RandomUserWorkspaceData[];
  workspaceMembers: RandomWorkspaceMemberData[];
  userIds: Record<string, string>;
  userWorkspaceIds: Record<string, string>;
  workspaceMemberIds: Record<string, string>;
} {
  const users: RandomUserData[] = [];
  const userWorkspaces: RandomUserWorkspaceData[] = [];
  const workspaceMembers: RandomWorkspaceMemberData[] = [];
  const userIds: Record<string, string> = {};
  const userWorkspaceIds: Record<string, string> = {};
  const workspaceMemberIds: Record<string, string> = {};

  const passwordHash =
    '$2b$10$3LwXjJRtLsfx4hLuuXhxt.3mWgismTiZFCZSG3z9kDrSfsrBl0fT6';

  for (let i = 1; i <= 1000; i++) {
    // Generate deterministic random indices for names
    const firstNameIndex = Math.floor(
      seededRandom(i * 1000) * FIRST_NAMES.length,
    );
    const lastNameIndex = Math.floor(
      seededRandom(i * 2000) * LAST_NAMES.length,
    );
    const colorSchemeIndex = Math.floor(
      seededRandom(i * 3000) * COLOR_SCHEMES.length,
    );

    const firstName = FIRST_NAMES[firstNameIndex];
    const lastName = LAST_NAMES[lastNameIndex];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`;

    // Generate consistent UUIDs based on index
    const userId =
      `30303030-${i.toString().padStart(4, '0')}-4000-8000-000000000000`.replace(
        /0{4}-4000-8000-000000000000$/,
        () => {
          const hex = (i * 12345).toString(16).padStart(12, '0').slice(0, 12);

          return `${hex.slice(0, 4)}-4000-8000-${hex.slice(4, 12)}`;
        },
      );

    const userWorkspaceId =
      `31313131-${i.toString().padStart(4, '0')}-4000-8000-000000000000`.replace(
        /0{4}-4000-8000-000000000000$/,
        () => {
          const hex = (i * 23456).toString(16).padStart(12, '0').slice(0, 12);

          return `${hex.slice(0, 4)}-4000-8000-${hex.slice(4, 12)}`;
        },
      );

    const workspaceMemberId =
      `32323232-${i.toString().padStart(4, '0')}-4000-8000-000000000000`.replace(
        /0{4}-4000-8000-000000000000$/,
        () => {
          const hex = (i * 34567).toString(16).padStart(12, '0').slice(0, 12);

          return `${hex.slice(0, 4)}-4000-8000-${hex.slice(4, 12)}`;
        },
      );

    userIds[`RANDOM_USER_${i}`] = userId;
    userWorkspaceIds[`RANDOM_USER_WORKSPACE_${i}`] = userWorkspaceId;
    workspaceMemberIds[`RANDOM_WORKSPACE_MEMBER_${i}`] = workspaceMemberId;

    users.push({
      id: userId,
      firstName,
      lastName,
      email,
      passwordHash,
      canImpersonate: false,
      canAccessFullAdminPanel: false,
      isEmailVerified: true,
    });

    userWorkspaces.push({
      id: userWorkspaceId,
      userId,
      workspaceId: '20202020-1c25-4d02-bf25-6aeccf7ea419', // SEED_SUKAMAJU_WORKSPACE_ID
    });

    workspaceMembers.push({
      id: workspaceMemberId,
      nameFirstName: firstName,
      nameLastName: lastName,
      locale: 'id-ID',
      colorScheme: COLOR_SCHEMES[colorSchemeIndex],
      userEmail: email,
      userId,
    });
  }

  return {
    users,
    userWorkspaces,
    workspaceMembers,
    userIds,
    userWorkspaceIds,
    workspaceMemberIds,
  };
}
