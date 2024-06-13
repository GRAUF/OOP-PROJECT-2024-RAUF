#! /usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import Table from 'cli-table3';

class User {
  constructor(
    public userId: string,
    public userName: string,
    public password: string
  ) {}
}

class UserManager {
  private users: User[] = [];

  addUser(userId: string, userName: string, password: string) {
    const user = new User(userId, userName, password);
    this.users.push(user);
    console.log(chalk.green(`User ${userName} added successfully!`));
  }

  removeUser(userId: string) {
    this.users = this.users.filter(user => user.userId !== userId);

    if (this.users.length === 0) {
      console.log(chalk.red('No users found!'));
      return;
    }
    console.log(chalk.red(`User with ID ${userId} removed successfully!`));
    
  } 

  updateUser(userId: string, newUserName: string, newPassword: string) {
    const user = this.users.find(user => user.userId === userId);
    if (user) {
      user.userName = newUserName;
      user.password = newPassword;
      console.log(chalk.blue(`User with ID ${userId} updated successfully!`));
    } else {
      console.log(chalk.red(`User with ID ${userId} not found!`));
    }
  }

  showUsers() {
    if (this.users.length === 0) {
      console.log(chalk.yellow('No users found!'));
      return;
    }

    const table = new Table({
      head: ['User ID', 'User Name', 'Password'],
      colWidths: [20, 20, 20]
    });

    this.users.forEach(user => {
      table.push([user.userId, user.userName, user.password]);
    });

    console.log(table.toString());
  }
}

const userManager = new UserManager();

async function mainMenu() {
  const choices = ['Add User', 'Remove User', 'Update User', 'Show Users', 'Exit'];
  
  const { action } = await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'Choose an action:',
    choices
  });

  switch (action) {
    case 'Add User':
      await addUser();
      break;
    case 'Remove User':
      await removeUser();
      break;
    case 'Update User':
      await updateUser();
      break;
    case 'Show Users':
      userManager.showUsers();
      break;
    case 'Exit':
      return;
  }

  await mainMenu();
}

async function addUser() {
  const { userId, userName, password } = await inquirer.prompt([
    { name: 'userId', type: 'input', message: 'Enter user ID:' },
    { name: 'userName', type: 'input', message: 'Enter user name:' },
    { name: 'password', type: 'password', message: 'Enter password:' },
  ]);

  userManager.addUser(userId, userName, password);
}

async function removeUser() {
  const { userId } = await inquirer.prompt([
    { name: 'userId', type: 'input', message: 'Enter user ID to remove:' },
  ]);
  if (userId === '') {
    console.log(chalk.red('User ID cannot be empty!'));
    return;
  }

  userManager.removeUser(userId);

}

async function updateUser() {
  const { userId, newUserName, newPassword } = await inquirer.prompt([
    { name: 'userId', type: 'input', message: 'Enter user ID to update:' },
    { name: 'newUserName', type: 'input', message: 'Enter new user name:' },
    { name: 'newPassword', type: 'password', message: 'Enter new password:' },
  ]);

  userManager.updateUser(userId, newUserName, newPassword);
}

mainMenu().then(() => console.log('Goodbye!Again Enter your data!')).catch(error => console.error(error));



