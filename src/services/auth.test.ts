import {
    createToken,
    getSecret,
    passwordEncrypt,
    readToken,
    passwordValidate,
} from './auth';
import jwt from 'jsonwebtoken';
import bc from 'bcryptjs';
import { SECRET } from '../config.js';
const mock = {
    id: 'ss',
    name: 'Pepe',
    password: '12345',
    email: 'pepe@gmail.com',
};

describe('Given "getSecret"', () => {
    describe('When it is not string', () => {
        test('Then an error should be throw', () => {
            expect(() => {
                getSecret('');
            }).toThrowError();
        });
    });
});

describe('Given "createToken, when it is called"', () => {
    test('then the token is created', () => {
        const signSpy = jest.spyOn(jwt, 'sign');
        const result = createToken(mock);
        expect(typeof result).toBe('string');
        expect(signSpy).toHaveBeenCalledWith(mock, SECRET);
    });
});

describe('Given "readToken"', () => {
    const validToken = createToken(mock);
    test('then', () => {
        const result = readToken(validToken);
        expect(result.name).toEqual(mock.name);
    });
});

describe('When there are no token', () => {
    const invalidToken = '';
    test('It should Throw and error', () => {
        expect(() => {
            readToken(invalidToken);
        }).toThrowError('jwt must be provided');
    });
});
describe('when token is Not valid', () => {
    const invalidToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlBlcGUiLCJpYXQiOjE2Njg3NzMwNTB9.DGdcCXGRUS4SaCMyY5RSy-8v9tylvmV_HE1rQJGYJ_55';
    test('It should  throw an error', () => {
        expect(() => {
            readToken(invalidToken);
        }).toThrowError('invalid signature');
    });
});

describe('when token is bad formatted', () => {
    const invalidToken = 'soy un token';
    test('It should throw an error', () => {
        expect(() => {
            readToken(invalidToken);
        }).toThrowError('jwt malformed');
    });
});

describe('Given "PasswordEncrypt" & passwordValidate', () => {
    const spyBcHash = jest.spyOn(bc, 'hash');
    const spyBcCompare = jest.spyOn(bc, 'compare');
    describe('when we call passwordEncrypt', () => {
        test('Bcrypt.hash should be call', async () => {
            await passwordEncrypt('12345');
            expect(spyBcHash).toHaveBeenCalled();
        });
    });
    describe(`Whe we call passwordValidate also
                and The passwd and its encryption are compared`, () => {
        let hash: string;
        const passwd = '12345';
        const badPasswd = '00000';

        beforeEach(async () => {
            hash = await passwordEncrypt(passwd);
        });

        test('Then a valid password should be detected', async () => {
            const result = await passwordValidate(passwd, hash);
            expect(spyBcCompare).toHaveBeenCalled();
            expect(result).toBe(true);
        });
        test('Then a valid password should be detected', async () => {
            const result = await passwordValidate(badPasswd, hash);
            expect(spyBcCompare).toHaveBeenCalled();
            expect(result).toBe(false);
        });
    });
});
