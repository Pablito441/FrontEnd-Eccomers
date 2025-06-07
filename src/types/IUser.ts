export type User = {
  id: number;
  name: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: "ADMIN" | "CLIENT";
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  isActive: boolean;
  // Métodos de UserDetails no suelen ser necesarios en el frontend, pero puedes agregarlos si los usas
  // isAccountNonExpired?: boolean;
  // isAccountNonLocked?: boolean;
  // isCredentialsNonExpired?: boolean;
  // isEnabled?: boolean;
};
