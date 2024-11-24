import { fail } from '@sveltejs/kit';

const fieldRequiredMessage = (fieldLabel) => `${fieldLabel} is required!`;
const fieldInvalidMessage = (fieldLabel) => `${fieldLabel} is invalid!`;

export const userFieldsLookup = {
    username: {
        label: 'Username',
        regex: '^[a-zA-Z0-9]{3,20}$',
    },
    firstName: {
        label: 'First name',
        regex: '^[a-zA-Z]{1,30}$',
    },
    lastName: {
        label: 'Last name',
        regex: '^[a-zA-Z]{1,30}$',
    },
    email: {
        label: 'Email',
        regex: '^[^@]+@[^@]+\\.[^@]+$',
    },
    password: {
        label: 'Password',
        regex: '^[^ ]{1,50}$',
    },
    oldPassword: {
        label: 'Old password',
        regex: '^[^ ]{1,50}$',
    },
};

export function validateUser(
    data,
    fields = ['username', 'firstName', 'lastName', 'email', 'password', 'phoneNum'],
    formId,
) {
    return baseValidator(data, fields, userFieldsLookup, formId);
}

function baseValidator(data, fields, fieldsLookup, formId) {
    fields = [...new Set(fields)]; //remove field duplicates
    fields = fields.filter((field) => fieldsLookup[field]); //only check fields in the lookup

    const errors = {};

    for (const field of fields) {
        if(data[field] === undefined || data[field] === '' || data[field]?.length === 0 || data[field]?.[0]?.size === 0) {
            errors[field] = fieldRequiredMessage(fieldsLookup[field].label);
        }
        else if(field === 'images') {
            errors[field] = validateImages(data[field]);
        }
        else if(fieldsLookup[field].regex && !(new RegExp(fieldsLookup[field].regex)).test(data[field])) {
            errors[field] = fieldsLookup[field].message ?? fieldInvalidMessage(fieldsLookup[field].label);
        }
    }

    if(Object.values(errors).filter(Boolean).length) {
        throw new Error('Failed to validate fields', {
            cause: { errors },
        });
    }

    //only return fields that have been validated
    return Object.fromEntries(
        Object.entries(data).filter(([ key ]) => {
            return fields.includes(key);
        })
    );
}

function validateImages(images) {
    if(!Array.isArray(images)) {
        return 'Invalid image list';
    }
    if(images.length < 3) {
        return 'Atleast 3 images need to be selected';
    }

    for (const image of images) {
        if(!(image instanceof File)) {
            return 'Invald image file(s)';
        }
        if(image.size > 1000000) {
            return 'Image size too big, must be under 1 megabyte';
        }
        if(!/^image\/(avif|jpeg|png|webp)$/.test(image.type)) {
            return 'Incorrect image format (accepted formats: .avif, .jpg, .jpeg, .png, .webp)';
        }
    }
}
