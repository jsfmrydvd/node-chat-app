const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {
    var users;
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'test',
            room: 'Node1'
        }, {
            id: '2',
            name: 'admin',
            room: 'Node2'
        }, {
            id: '3',
            name: 'sef',
            room: 'Node1'
        }];
    });
    it('should add new user', () => {
        var users = new Users();
        var user = {
            id: '123',
            name: 'Josef',
            room: 'test'
        };
        var resUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
    });
    it('should remove a user', () => {
        var userId = '1';
        var user = users.removeUser(userId);
        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });
    it('should not remove a user', () => {
        var userId = '99';
        var user = users.removeUser(userId);
        expect(user).toBeFalsy();
        expect(users.users.length).toBe(3);
    });
    it('should find user', () => {
        var userId = '2';
        var user = users.getUser(userId);

        expect(user.id).toBe(userId);
    });
    it('should not find user', () => {
        var userId = '333';
        var user = users.getUser(userId);
        expect(user).toBeFalsy();
    });
    it('should return names for node course', () => {
        var userList = users.getUserList('Node1');
        expect(userList).toEqual(['test', 'sef']);
    });
    it('should return names for node course', () => {
        var userList = users.getUserList('Node2');
        expect(userList).toEqual(['admin']);
    });
});
