export const userFieldsRegex = {
    username: '^[a-zA-Z0-9]{3,20}$',
    firstName: '^[a-zA-Z]{1,30}$',
    lastName: '^[a-zA-Z]{1,30}$',
    email: '^[^@]+@[^@]+\\.[^@]+$',
    password: '^[^ ]{1,50}$',
};

export const gameFieldsRegex = {
    name: '^[a-zA-Z0-9 :()-]{1,100}$',
    description: '^[\\s\\S]{1,1000}$',
};
