// After `a w`, nothing may follow, so a newline there is skipped whitespace: the EOF carries it as
// padding. After `b w`, a newline is a token. Replacing `a` with `b` must not reuse that EOF.

export default grammar({
    name: 'reuse_eof_in_another_lex_mode',

    rules: {
        source_file: $ => choice(seq('a', 'w'), seq('b', 'w', optional($.newline))),
        newline: _ => /\n/,
    },
});
