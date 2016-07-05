export class SysUserModel {
	public sysUserId: string;
	public name: string;
	public password: string;
	public repassword: string;
	public newPassword: string;
	public renewPassword: string;
	public role: string = 'ROLE_ADMIN';
	public crtUid:string;
	public crtName: string;
	public crtDate: string;
	public crtTime: string;
	public updUid: string;
	public updName: string;
	public updDate: string;
	public updTime: string;
	public changePassword: boolean = false;

}