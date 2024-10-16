import { forwardRef, ForwardedRef, useId } from 'react';
import { ChangeEvent, InputHTMLAttributes } from 'react';

export type AuthInputProps = {
  name: string;
  label: string;
  type?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  classNames?: string;
  inputAttrs?: InputHTMLAttributes<HTMLInputElement>;
  children: React.ReactNode;
};

const AuthInput = (
  {
    name,
    label,
    type,
    onChange,
    classNames,
    inputAttrs,
    children,
  }: AuthInputProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const id = useId();
  return (
    <>
      <div className='input-box'>
        <span className='input-icon'>{children}</span>
        <input
          name={name}
          id={id}
          type={type}
          className={`peer ${classNames}`}
          onChange={onChange}
          ref={ref}
          {...inputAttrs}
          required
        />
        <label
          className='peer-valid:top-[-5px] peer-focus:top-[-5px]'
          htmlFor={id}
        >
          {label}
        </label>
      </div>
    </>
  );
};

const AuthInputRef = forwardRef(AuthInput);
export default AuthInputRef;
