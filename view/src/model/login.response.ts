export interface LoginResponse {
	jwt: string;
	refreshToken: string;
	username: string;
	role: string;
}