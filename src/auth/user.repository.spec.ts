import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import * as bcrypt from 'bcrypt';

const mockCredentialDto = { username: 'testUser', password: 'testPassword' };

describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();
    userRepository = await module.get<UserRepository>(UserRepository);
  })


  describe('signUp', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('successfully signs up the user', () => {
      save.mockResolvedValue(undefined);
      expect(userRepository.signUp(mockCredentialDto)).resolves.not.toThrow();
    });

    it('throws a conflic exception as username already exists', async () => {
      save.mockRejectedValue({ code: '23505' });
      return expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(ConflictException);
    })

    it('throws a conflic exception as username already exists', async () => {
      save.mockRejectedValue({ code: '123123' }); // unhandle error code
      return expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(InternalServerErrorException);
    })
  });

  describe('validateUserPassword', () => {
    let user;
    let bcryptCompare: jest.Mock;
    beforeEach(() => {
      userRepository.findOne = jest.fn();
      bcryptCompare = jest.fn();
      (bcrypt.compare as jest.Mock) = bcryptCompare;
      user = new User();
      user.username = 'testUsername';
      user.password = 'testUserPassword';

    })

    it('return user as validation is sucessful', async () => {
      userRepository.findOne.mockResolvedValue(user);
      bcryptCompare.mockReturnValue(true);
      const result = await userRepository.signIn(mockCredentialDto);
      expect(result.username).toEqual('testUsername');
    });

    it('return null as user cannot be found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const result = await userRepository.signIn(mockCredentialDto);
      expect(bcryptCompare).not.toHaveBeenCalled();
      expect(result).toBeNull();
    })

    it('returns null as password is invalid', async () => {
      userRepository.findOne.mockResolvedValue(true);
      bcryptCompare.mockReturnValue(false);
      const result = await userRepository.signIn(mockCredentialDto);
      expect(userRepository.findOne).toBeCalled();
      expect(result).toBeNull();
    })
  })

})
