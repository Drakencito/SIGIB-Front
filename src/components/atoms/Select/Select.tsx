import type { FC, SelectHTMLAttributes } from "react";

type ISelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const Select: FC<ISelectProps> = ({ ...rest }) => {
    return <select {...rest} />;
};

export default Select;
