// Without the `,` at byte 1, nodes are built in states where no version splits. After the `,` is
// restored they start in states where the stack splits, so they must not be reused.

export default grammar({
  name: 'reuse_where_another_state_would_split',
  conflicts: $ => [[$.n0, $.n1], [$.n2, $.n3], [$.n2], [$.n3], [$.n1, $.n4], [$.n0], [$.n0, $.n3]],
  rules: {
    source: $ => repeat($.n0),
    n0: $ => choice(seq($.n3, repeat($.n4), $.n2), seq('b', $.n5, optional('a')), seq($.n3, $.n1, $.n2, repeat($.n5))),
    n1: $ => choice(seq(',', $.n5, ';'), 'b', 'z'),
    n2: $ => choice(prec.dynamic(2, seq($.n1, optional('y'), $.n3, 'y')), seq(')', $.n1, ';'), ')'),
    n3: $ => choice(seq(')', repeat($.n5), ';'), ')', seq($.n2, ',', $.n2), ';'),
    n4: $ => choice(seq($.n1, 'z', $.n4), 'z'),
    n5: $ => choice(seq('b', 'a'), 'y'),
  }
});
