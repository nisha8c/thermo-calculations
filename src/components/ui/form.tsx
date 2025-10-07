"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
    Controller,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
    type FieldError,
    useFormContext,
} from "react-hook-form";

import { cn } from "../../lib/utils.ts";
import { Label as UiLabel } from "./label"; // ✅ value import (not `import type`)

/* ------------------------------------------------------------------ */
/* Form (re-export)                                                    */
/* ------------------------------------------------------------------ */
export { FormProvider as Form } from "react-hook-form";

/* ------------------------------------------------------------------ */
/* Contexts                                                           */
/* ------------------------------------------------------------------ */

type FormFieldContextValue = { name: string };
const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

type FormItemContextValue = { id: string };
const FormItemContext = React.createContext<FormItemContextValue | null>(null);

/* ------------------------------------------------------------------ */
/* Hooks                                                              */
/* ------------------------------------------------------------------ */

type UseFormFieldReturn = {
    id: string;
    name: string;
    formItemId: string;
    formDescriptionId: string;
    formMessageId: string;
    invalid: boolean;
    isDirty: boolean;
    isTouched: boolean;
    error?: FieldError;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useFormField(): UseFormFieldReturn {
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);
    const { getFieldState, formState } = useFormContext();

    if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField>");
    }
    if (!itemContext) {
        throw new Error("useFormField should be used within <FormItem>");
    }

    const fieldState = getFieldState(fieldContext.name as FieldPath<FieldValues>, formState);

    const { id } = itemContext;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        invalid: fieldState.invalid,
        isDirty: fieldState.isDirty,
        isTouched: fieldState.isTouched,
        error: fieldState.error,
    };
}

/* ------------------------------------------------------------------ */
/* Field (Controller wrapper)                                         */
/* ------------------------------------------------------------------ */

export function FormField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: ControllerProps<TFieldValues, TName>) {
    return (
        <FormFieldContext.Provider value={{ name: String(props.name) }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    );
}

/* ------------------------------------------------------------------ */
/* Item                                                               */
/* ------------------------------------------------------------------ */

type FormItemProps = React.HTMLAttributes<HTMLDivElement>;

export const FormItem = React.forwardRef<React.ComponentRef<"div">, FormItemProps>(
    ({ className, ...props }, ref) => {
        const id = React.useId();

        return (
            <FormItemContext.Provider value={{ id }}>
                <div ref={ref} className={cn("space-y-2", className)} {...props} />
            </FormItemContext.Provider>
        );
    }
);
FormItem.displayName = "FormItem";

/* ------------------------------------------------------------------ */
/* Label                                                              */
/* ------------------------------------------------------------------ */

type FormLabelProps = React.ComponentPropsWithoutRef<typeof UiLabel>;

export const FormLabel = React.forwardRef<React.ComponentRef<typeof UiLabel>, FormLabelProps>(
    ({ className, ...props }, ref) => {
        const { error, formItemId } = useFormField();

        return (
            <UiLabel
                ref={ref}
                className={cn(error && "text-destructive", className)}
                htmlFor={formItemId}
                {...props}
            />
        );
    }
);
FormLabel.displayName = "FormLabel";

/* ------------------------------------------------------------------ */
/* Control                                                             */
/* ------------------------------------------------------------------ */

type FormControlProps = React.ComponentPropsWithoutRef<typeof Slot>;

export const FormControl = React.forwardRef<React.ComponentRef<typeof Slot>, FormControlProps>(
    ({ ...props }, ref) => {
        const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

        return (
            <Slot
                ref={ref}
                id={formItemId}
                aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
                aria-invalid={!!error}
                {...props}
            />
        );
    }
);
FormControl.displayName = "FormControl";

/* ------------------------------------------------------------------ */
/* Description                                                         */
/* ------------------------------------------------------------------ */

type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const FormDescription = React.forwardRef<
    React.ComponentRef<"p">,
    FormDescriptionProps
>(({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return (
        <p
            ref={ref}
            id={formDescriptionId}
            className={cn("text-[0.8rem] text-muted-foreground", className)}
            {...props}
        />
    );
});
FormDescription.displayName = "FormDescription";

/* ------------------------------------------------------------------ */
/* Message                                                             */
/* ------------------------------------------------------------------ */

type FormMessageProps = React.HTMLAttributes<HTMLParagraphElement>;

export const FormMessage = React.forwardRef<React.ComponentRef<"p">, FormMessageProps>(
    ({ className, children, ...props }, ref) => {
        const { error, formMessageId } = useFormField();
        const body = error ? String(error.message ?? "") : children;

        if (!body) return null;

        return (
            <p
                ref={ref}
                id={formMessageId}
                className={cn("text-[0.8rem] font-medium text-destructive", className)}
                {...props}
            >
                {body}
            </p>
        );
    }
);
FormMessage.displayName = "FormMessage";
