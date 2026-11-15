// From a random grammar. Parsing `=;=bz=;=;;=;c;zb=;bcb}` goes through error recovery, which looks at
// states below the nodes reduced afterwards. With `bz` deleted, a reparse must not reuse those nodes.

export default grammar({
  name: 'reuse_after_recovery_examined_earlier_states',
  conflicts: $ => [[$.n1], [$.n0, $.n1]],
  rules: {
    source: $ => repeat($.n0),
    n0: $ => prec.dynamic(2, seq($.n2, $.n2, $.n2, $.n1)),
    n1: $ => choice(seq('c', optional('z'), 'b', '}'), seq('=', optional(';'), optional(';')), seq($.n1, '=', $.n2), 'z'),
    n2: $ => choice(seq($.n1, $.n2), 'b'),
  }
});
