class getUsersDTO {
    constructor(user) {
        this.email = user.email;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.age = user.age;
        this.full_name = `${user.first_name} ${user.last_name}`;
    }
}

export default getUsersDTO;