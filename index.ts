import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";
import path from "path";

interface Student {
  id: string;
  name: string;
  fatherName: string;
  age: number;
  gender: string;
  address: string;
  phone: string;
  email: string;
}

class StudentManager {
  private students: Student[];
  private dataFilePath: string;

  constructor() {
    this.dataFilePath = path.join(process.cwd(), "students.json");
    this.students = this.loadData();
  }

  private loadData(): Student[] {
    if (fs.existsSync(this.dataFilePath)) {
      const data = fs.readFileSync(this.dataFilePath, "utf-8");
      return JSON.parse(data);
    } else {
      return [];
    }
  }

  private saveData(): void {
    fs.writeFileSync(this.dataFilePath, JSON.stringify(this.students, null, 2));
  }

  addStudent(student: Omit<Student, 'id'>): void {
    const newId = `enr/${String(this.students.length + 1).padStart(3, '0')}`;
    const newStudent: Student = { ...student, id: newId };
    this.students.push(newStudent);
    this.saveData();
    console.log(chalk.yellow.bold('Student added successfully!'));
  }

  editStudent(index: number, updatedData: Omit<Student, 'id'>): void {
    if (index >= 0 && index < this.students.length) {
      const existingStudent = this.students[index];
      this.students[index] = { ...existingStudent, ...updatedData };
      this.saveData();
      console.log(chalk.yellow.bold('Student updated successfully'));
    } else {
      console.log(chalk.red.bold("Invalid index"));
    }
  }

  deleteStudent(index: number): void {
    if (index >= 0 && index < this.students.length) {
      this.students.splice(index, 1);
      this.saveData();
      console.log(chalk.bgRedBright.bold('Student deleted successfully'));
    } else {
      console.log(chalk.red.bold("Invalid index"));
    }
  }

  displayAllStudents(): void {
    if (this.students.length === 0) {
      console.log(chalk.yellow.bold("No students available."));
      return;
    }
    console.log(chalk.yellow.bold("List of All Students:"));
    this.students.forEach((student, index) => {
      console.log(chalk.blue.bold(`Student ${index + 1}:`));
      console.log(`
        ${chalk.green.bold('ID:')} ${chalk.white(student.id)}
        ${chalk.green.bold('Name:')} ${chalk.white(student.name)}
        ${chalk.green.bold("Father's Name:")} ${chalk.white(student.fatherName)}
        ${chalk.green.bold('Age:')} ${chalk.white(student.age.toString())}
        ${chalk.green.bold('Gender:')} ${chalk.white(student.gender)}
        ${chalk.green.bold('Address:')} ${chalk.white(student.address)}
        ${chalk.green.bold('Phone:')} ${chalk.white(student.phone)}
        ${chalk.green.bold('Email:')} ${chalk.white(student.email)}
      `);
    });
  }
}

async function main() {
  const manager = new StudentManager();

  const mainMenuChoices = [
    'Add a new student',
    'Edit an existing student',
    'Delete a student',
    'Display all students',
    'Exit'
  ];

  let exit = false;

  while (!exit) {
    const { action } = await inquirer.prompt({
      name: 'action',
      type: 'list',
      message: 'Select an action:',
      choices: mainMenuChoices
    });

    switch (action) {
      case 'Add a new student':
        const newStudentData = await inquirer.prompt([
          { name: 'name', type: 'input', message: 'Enter student name:' },
          { name: 'fatherName', type: 'input', message: 'Enter student father\'s name:' },
          { name: 'age', type: 'number', message: 'Enter student age:' },
          { name: 'gender', type: 'list', message: 'Select student gender:', choices: ['Male', 'Female'] },
          { name: 'address', type: 'input', message: 'Enter student address:' },
          { name: 'phone', type: 'input', message: 'Enter student phone number:' },
          { name: 'email', type: 'input', message: 'Enter student email address:' },
        ]);
        manager.addStudent(newStudentData);
        break;

      case 'Edit an existing student':
        const { editIndex } = await inquirer.prompt({
          name: 'editIndex',
          type: 'number',
          message: 'Enter the index of the student to edit:'
        });
        const updatedStudentData = await inquirer.prompt([
          { name: 'name', type: 'input', message: 'Enter student name:' },
          { name: 'fatherName', type: 'input', message: 'Enter student father\'s name:' },
          { name: 'age', type: 'number', message: 'Enter student age:' },
          { name: 'gender', type: 'list', message: 'Select student gender:', choices: ['Male', 'Female'] },
          { name: 'address', type: 'input', message: 'Enter student address:' },
          { name: 'phone', type: 'input', message: 'Enter student phone number:' },
          { name: 'email', type: 'input', message: 'Enter student email address:' },
        ]);
        manager.editStudent(editIndex - 1, updatedStudentData);
        break;

      case 'Delete a student':
        const { deleteIndex } = await inquirer.prompt({
          name: 'deleteIndex',
          type: 'number',
          message: 'Enter the index of the student to delete:'
        });
        manager.deleteStudent(deleteIndex - 1);
        break;

      case 'Display all students':
        manager.displayAllStudents();
        break;

      case 'Exit':
        exit = true;
        console.log(chalk.red.bold('Exiting...'));
        break;
    }
  }
}

main().catch(err => console.error(err));
