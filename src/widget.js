export default (name, validator, f) => ({
    values,
    errors,
    submitted,
    register,
    SetValues,
    SetErrors,
}) => {
    if (validator)
        register((errors, values) => ({
            ...errors,
            [name]: validator(values[name], values),
        }))
    const Set = [SetValues, x => ({ ...values, [name]: x })]
    const Validate = validator
        ? [SetErrors, x => ({ ...errors, [name]: validator(x, values) })]
        : x => x //noop
    return f({
        disabled: submitted,
        value: values[name],
        error: errors[name],
        Set,
        Validate,
    })
}
