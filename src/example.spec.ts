class FriendList {
  friends = [];

  addFriend(name) {
    this.friends.push(name);
    this.announceFriendship(name);
  }

  announceFriendship(name) {
    global.console.log(`${name} is now friend`);
  }

  removeFriend(name) {
    const idx = this.friends.indexOf(name);

    if (idx === -1) {
      throw new Error('Friend not found');
    }

    this.friends.splice(idx, 1);
  }
}

// test
describe('FriendsList', () => {
  let friendList;
  beforeEach(() => {
    friendList = new FriendList();
  });

  it('initializes friends list', () => {
    expect(friendList.friends.length).toEqual(0);
  });

  it('add a friend to the list', () => {
    friendList.addFriend('Zeika')
    expect(friendList.friends.length).toEqual(1);
  });

  it('annouce friendship', () => {
    friendList.announceFriendship = jest.fn();
    expect(friendList.announceFriendship).not.toHaveBeenCalled();
    friendList.addFriend('Zeika');
    expect(friendList.announceFriendship).toHaveBeenCalledWith('Zeika');
  });

  describe('remove a friend ', () => {
    it('remove a friend from the list', () => {
      friendList.addFriend('Zeika');
      expect(friendList.friends[0]).toEqual('Zeika');
      friendList.removeFriend('Zeika');
      expect(friendList.friends[0]).toBeUndefined();
    });

    it('throw an error as friend does not exist', () => {
      expect(() => friendList.removeFriend('Zeika')).toThrow(new Error('Friend not found'))
    })
  })
})