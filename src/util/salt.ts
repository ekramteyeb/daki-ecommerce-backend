import bcrypt from 'bcrypt'

export default async function hashPassword(password: string): Promise<string> {
  //password hash + salt
  const saltRound = 10
  const passwordHash = await bcrypt.hash(password, saltRound)

  return passwordHash
}
