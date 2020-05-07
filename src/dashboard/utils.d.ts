declare function fetchGuild(guildID: any, client: any, guilds: any): Promise<any>;
declare function fetchUser(userData: any, client: any, query?: any): Promise<any>;
declare function fetchUsers(array: any, client: any): Promise<unknown>;
declare const _default: {
    fetchUser: typeof fetchUser;
    fetchUsers: typeof fetchUsers;
    fetchGuild: typeof fetchGuild;
};
export default _default;
