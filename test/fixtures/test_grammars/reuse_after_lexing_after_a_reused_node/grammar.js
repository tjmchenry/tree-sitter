// `,` is reused as an `n1`, and in a fresh parse the token after it is lexed in the state after `,`, which
// recognizes `zx`. The state after the `n1` recognizes only `z`.

export default grammar({
  name: 'reuse_after_lexing_after_a_reused_node',
  rules: {
    source: $ => repeat($.n0),
    n0: $ => choice(seq(repeat($.n1), 'y', 'x'), 'x', seq('{', $.n1, $.n2)),
    n1: $ => choice(seq('z', 'b', ';', $.n1), ','),
    n2: $ => choice(seq('y', optional(';')), 'zx'),
    n3: $ => choice(seq($.n1, $.n3, 'x', '{'), ','),
  }
});
