// In `if (e) break⏎if else x()`, the second `if` can't take `else`, and error recovery puts the
// version back after the first `if` statement, behind an error. If that statement was reused from
// an old tree, `else` must not break it down and attach to it.

export default grammar({
    name: 'reuse_before_recovery_error',

    word: $ => $.identifier,

    reserved: {
        global: _ => ['if', 'else', 'break'],
    },

    rules: {
        source_file: $ => repeat($._statement),
        _statement: $ => choice($.if_statement, $.break_statement, $.call),
        if_statement: $ => prec.right(seq(
            'if',
            $.condition,
            $._statement,
            optional(seq('else', $._statement)),
        )),
        condition: $ => seq('(', $.identifier, ')'),
        break_statement: _ => 'break',
        call: $ => seq($.identifier, '(', ')'),
        identifier: _ => /[a-z]+/,
    },
});
