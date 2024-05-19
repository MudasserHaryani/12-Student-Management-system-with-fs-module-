var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";
import path from "path";
class StudentManager {
    constructor() {
        this.dataFilePath = path.join(process.cwd(), "students.json");
        this.students = this.loadData();
    }
    loadData() {
        if (fs.existsSync(this.dataFilePath)) {
            const data = fs.readFileSync(this.dataFilePath, "utf-8");
            return JSON.parse(data);
        }
        else {
            return [];
        }
    }
    saveData() {
        fs.writeFileSync(this.dataFilePath, JSON.stringify(this.students, null, 2));
    }
    addStudent(student) {
        const newId = `enr/${String(this.students.length + 1).padStart(3, '0')}`;
        const newStudent = Object.assign(Object.assign({}, student), { id: newId });
        this.students.push(newStudent);
        this.saveData();
        console.log(chalk.yellow.bold('Student added successfully!'));
    }
    editStudent(index, updatedData) {
        if (index >= 0 && index < this.students.length) {
            const existingStudent = this.students[index];
            this.students[index] = Object.assign(Object.assign({}, existingStudent), updatedData);
            this.saveData();
            console.log(chalk.yellow.bold('Student updated successfully'));
        }
        else {
            console.log(chalk.red.bold("Invalid index"));
        }
    }
    deleteStudent(index) {
        if (index >= 0 && index < this.students.length) {
            this.students.splice(index, 1);
            this.saveData();
            console.log(chalk.bgRedBright.bold('Student deleted successfully'));
        }
        else {
            console.log(chalk.red.bold("Invalid index"));
        }
    }
    displayAllStudents() {
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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
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
            const { action } = yield inquirer.prompt({
                name: 'action',
                type: 'list',
                message: 'Select an action:',
                choices: mainMenuChoices
            });
            switch (action) {
                case 'Add a new student':
                    const newStudentData = yield inquirer.prompt([
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
                    const { editIndex } = yield inquirer.prompt({
                        name: 'editIndex',
                        type: 'number',
                        message: 'Enter the index of the student to edit:'
                    });
                    const updatedStudentData = yield inquirer.prompt([
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
                    const { deleteIndex } = yield inquirer.prompt({
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
    });
}
main().catch(err => console.error(err));
