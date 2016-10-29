export class SysSettingModel {
	public sysSettingId: string;
	public name: string;
	public hostname: string;
	public port: number;
	public loginName:string;
	public password: string;
	public deviceLimit: number;

	public guestLimit: number;
	public guestStart: string;
	public guestEnd: string;

	public enableUserDevice: boolean;
	public enableGuest: boolean;

}