import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { employeeService } from '../services/employeeService';

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [employeeDialog, setEmployeeDialog] = useState(false);
    const [employee, setEmployee] = useState({});
    const [selectedEmployees, setSelectedEmployees] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);

    const genderOptions = [
        { label: 'Male', value: 1 },
        { label: 'Female', value: 2 }
    ];

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        setLoading(true);
        try {
            const data = await employeeService.getEmployees();
            setEmployees(data);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load employees',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setEmployee({
            fullName: '',
            gender: 1,
            dateOfBirth: new Date()
        });
        setSubmitted(false);
        setEmployeeDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setEmployeeDialog(false);
    };

    const saveEmployee = async () => {
        setSubmitted(true);

        // For new employees, don't require staffId (it will be auto-generated)
        // For existing employees, require staffId
        const isNewEmployee = !employee.id;
        const isValidNewEmployee = isNewEmployee && employee.fullName && employee.gender && employee.dateOfBirth;
        const isValidExistingEmployee = !isNewEmployee && employee.staffId && employee.fullName && employee.gender && employee.dateOfBirth;

        if (isValidNewEmployee || isValidExistingEmployee) {
            try {
                // Prepare the data for API
                const employeeData = {
                    ...employee,
                    dateOfBirth: employee.dateOfBirth instanceof Date 
                        ? employee.dateOfBirth.toISOString() 
                        : employee.dateOfBirth
                };

                if (employee.id) {
                    // Update existing employee
                    await employeeService.updateEmployee(employee.id, employeeData);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Employee Updated',
                        life: 3000
                    });
                } else {
                    // Create new employee
                    await employeeService.createEmployee(employeeData);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Employee Created',
                        life: 3000
                    });
                }
                
                await loadEmployees();
                setEmployeeDialog(false);
                setEmployee({});
            } catch (error) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save employee',
                    life: 3000
                });
            }
        }
    };

    const editEmployee = (employee) => {
        const employeeToEdit = {
            ...employee,
            dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth) : new Date()
        };
        setEmployee(employeeToEdit);
        setEmployeeDialog(true);
    };

    const confirmDeleteEmployee = (employee) => {
        confirmDialog({
            message: 'Are you sure you want to delete this employee?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteEmployee(employee)
        });
    };

    const deleteEmployee = async (employee) => {
        try {
            await employeeService.deleteEmployee(employee.id);
            await loadEmployees();
            toast.current.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Employee Deleted',
                life: 3000
            });
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete employee',
                life: 3000
            });
        }
    };

    const confirmDeleteSelected = () => {
        confirmDialog({
            message: 'Are you sure you want to delete the selected employees?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: deleteSelectedEmployees
        });
    };

    const deleteSelectedEmployees = async () => {
        try {
            for (const emp of selectedEmployees) {
                await employeeService.deleteEmployee(emp.id);
            }
            await loadEmployees();
            setSelectedEmployees(null);
            toast.current.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Employees Deleted',
                life: 3000
            });
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete employees',
                life: 3000
            });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _employee = { ...employee };
        _employee[`${name}`] = val;
        setEmployee(_employee);
    };

    const onDateChange = (e) => {
        let _employee = { ...employee };
        _employee.dateOfBirth = e.value;
        setEmployee(_employee);
    };

    const onGenderChange = (e) => {
        let _employee = { ...employee };
        _employee.gender = e.value;
        setEmployee(_employee);
    };

    const formatGender = (gender) => {
        return gender === 1 ? 'Male' : gender === 2 ? 'Female' : '';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const genderBodyTemplate = (rowData) => {
        return formatGender(rowData.gender);
    };

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.dateOfBirth);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    label="New"
                    icon="pi pi-plus"
                    className="p-button-success mr-2"
                    onClick={openNew}
                />
                <Button
                    label="Delete"
                    icon="pi pi-trash"
                    className="p-button-danger"
                    onClick={confirmDeleteSelected}
                    disabled={!selectedEmployees || !selectedEmployees.length}
                />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        type="search"
                        onInput={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search..."
                    />
                </span>
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => editEmployee(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning"
                    onClick={() => confirmDeleteEmployee(rowData)}
                />
            </React.Fragment>
        );
    };

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Manage Employees</h5>
        </div>
    );

    const employeeDialogFooter = (
        <React.Fragment>
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={hideDialog}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                className="p-button-text"
                onClick={saveEmployee}
            />
        </React.Fragment>
    );

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />

            <div className="card">
                <Toolbar
                    className="mb-4"
                    left={leftToolbarTemplate}
                    right={rightToolbarTemplate}
                ></Toolbar>

                <DataTable
                    ref={dt}
                    value={employees}
                    selection={selectedEmployees}
                    onSelectionChange={(e) => setSelectedEmployees(e.value)}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    className="datatable-responsive"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
                    globalFilter={globalFilter}
                    header={header}
                    loading={loading}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="staffId" header="Staff ID" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="fullName" header="Full Name" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="gender" header="Gender" body={genderBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="dateOfBirth" header="Date of Birth" body={dateBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog
                visible={employeeDialog}
                style={{ width: '450px' }}
                header="Employee Details"
                modal
                className="p-fluid"
                footer={employeeDialogFooter}
                onHide={hideDialog}
            >
                {/* Only show Staff ID field for existing employees (updates) */}
                {employee.id && (
                    <div className="field">
                        <label htmlFor="staffId">Staff ID</label>
                        <InputText
                            id="staffId"
                            value={employee.staffId || ''}
                            readOnly
                            disabled
                            className="p-disabled"
                        />
                        <small className="p-help">Staff ID cannot be modified</small>
                    </div>
                )}
                <div className="field">
                    <label htmlFor="fullName">Full Name</label>
                    <InputText
                        id="fullName"
                        value={employee.fullName || ''}
                        onChange={(e) => onInputChange(e, 'fullName')}
                        required
                        autoFocus={!employee.id} // Only autofocus for new employees
                        className={submitted && !employee.fullName ? 'p-invalid' : ''}
                    />
                    {submitted && !employee.fullName && <small className="p-error">Full Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="gender">Gender</label>
                    <Dropdown
                        id="gender"
                        value={employee.gender}
                        onChange={onGenderChange}
                        options={genderOptions}
                        placeholder="Select Gender"
                        required
                        className={submitted && !employee.gender ? 'p-invalid' : ''}
                    />
                    {submitted && !employee.gender && <small className="p-error">Gender is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <Calendar
                        id="dateOfBirth"
                        value={employee.dateOfBirth}
                        onChange={onDateChange}
                        dateFormat="mm/dd/yy"
                        showIcon
                        required
                        className={submitted && !employee.dateOfBirth ? 'p-invalid' : ''}
                    />
                    {submitted && !employee.dateOfBirth && <small className="p-error">Date of Birth is required.</small>}
                </div>
            </Dialog>

            <ConfirmDialog />
        </div>
    );
}
