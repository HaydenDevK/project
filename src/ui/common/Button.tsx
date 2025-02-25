import { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * 공통 버튼 컴포넌트입니다.
 * size - 버튼 크기. 'small', 'middle', 'large' 중 하나를 선택합니다.
 * variant - 버튼 스타일. 'solid' 또는 'outlined' 중 하나를 선택합니다.
 * rounded - 버튼의 모서리를 둥글게 처리할지 여부. true면 완전 둥근 버튼이 됩니다.
 * fullWidth - 버튼의 너비를 부모 요소의 100%로 설정할지 여부. true면 버튼이 전체 너비를 차지합니다.
 * className - 사용자 정의 Tailwind CSS 클래스를 추가할 수 있습니다.
 */

interface IButtonProps extends ComponentPropsWithoutRef<'button'> {
  size?: 'xsmall' | 'small' | 'middle' | 'large';
  variant?: 'solid' | 'outlined';
  rounded?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export default function Button(props: IButtonProps) {
  const {
    size = 'small',
    variant = 'solid',
    rounded = false,
    fullWidth = false,
    className,
    children,
    disabled,
    onClick,
    ...rest
  } = props;

  const baseStyles =
    'flex items-center justify-center gap-2.5 rounded-xl border border-primary font-semibold';

  const sizeStyles = {
    xsmall: 'h-8 w-16 rounded-[0.5rem] py-[0.375rem] text-sm leading-tight',
    small: 'h-9 w-[5.25rem] py-2 text-sm leading-tight',
    middle: 'h-11 w-[9.375rem] py-3 text-sm leading-tight',
    large: 'h-12 w-[18.125rem] py-3 text-base leading-normal',
  };

  const variantStyles = {
    solid:
      'bg-primary text-white hover:border-mint-700 hover:bg-mint-700 active:border-mint-800 active:bg-mint-800 disabled:border-slate-400 disabled:bg-slate-400',
    outlined:
      'bg-white text-primary hover:border-mint-700 hover:text-mint-700 active:border-mint-800 active:text-mint-800 disabled:border-slate-400 disabled:text-slate-400',
  };

  return (
    <button
      className={twMerge(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        rounded && 'rounded-full',
        fullWidth && 'w-full',
        className,
      )}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
