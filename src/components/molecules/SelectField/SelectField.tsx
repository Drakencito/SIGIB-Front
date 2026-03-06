import type { FC, SelectHTMLAttributes, ReactNode } from "react";
import Label from "../../atoms/Label/Label";
import Select from "../../atoms/Select/Select";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    id: string;
    children: ReactNode;
}

const SelectField: FC<SelectFieldProps> = ({ label, id, children, ...rest }) => {
    return (
        <div className="field">
            <Label text={label} htmlFor={id} />
            <Select id={id} {...rest}>
                {children}
            </Select>
        </div>
    );
};

export default SelectField;
