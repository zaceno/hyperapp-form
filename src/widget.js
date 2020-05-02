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
    const Set = (_, x) => [SetValues, { ...values, [name]: x }]
    const Validate = validator
        ? (_, x) => [SetErrors, { ...errors, [name]: validator(x, values) }]
        : _ => _ //noop
    return f({
        disabled: submitted,
        value: values[name],
        error: errors[name],
        Set,
        Validate,
    })
}
