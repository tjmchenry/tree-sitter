// In `zxa}}}}(}xa(xa;`, recovery puts a missing `xa` before the `z`, and the version that skips the
// `z` instead stays alive while the nested `n1` after it is parsed. Versions of that `n1` are dropped
// by the version cap while it lives. The stack node that the `n3` is reduced from is at byte 0, like
// the stack node where the two recoveries split: only the missing token is between them.

export default grammar({
  name: 'reuse_after_a_drop_past_a_missing_token',
  conflicts: $ => [[$.n0, $.n1], [$.n1], [$.n1, $.n5], [$.n1, $.n4, $.n5], [$.n1, $.n4], [$.n2, $.n3], [$.n0, $.n2], [$.n4, $.n5]],
  rules: {
    source: $ => repeat($.n0),
    n0: $ => choice(seq($.n1, $.n3), seq('xa', $.n5, repeat($.n5), $.n4)),
    n1: $ => choice(prec.dynamic(1, 'xa'), seq('}', $.n1, optional('('), $.n1), '}'),
    n2: $ => choice(prec.dynamic(2, seq($.n1, $.n2, $.n5, ';')), $.n4, seq('(', ')')),
    n3: $ => choice(prec.dynamic(2, seq($.n1, $.n2, optional('y'))), seq('z', $.n5, $.n1, ';'), seq(')', $.n4, $.n4), ';'),
    n4: $ => choice('}', prec.dynamic(1, seq($.n2, 'z'))),
    n5: $ => choice(seq(optional('('), $.n2), seq('(', $.n3), 'xa', '}'),
  }
});
