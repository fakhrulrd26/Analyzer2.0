export interface UserInterface { id: number, name: string, email: string, username: string, country_code: string | null }

export function mapper (user: any): UserInterface {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    country_code: user.country_code
  }
}
