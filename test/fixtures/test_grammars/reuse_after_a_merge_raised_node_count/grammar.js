// `a b b b b b z` is read as one `p` and as `ai bi … zi`. Both readings reach the node after `z` and merge
// there one token later, which raises that node's count to the larger reading's. At the error at `k`,
// the version with a missing `c` counts that raise, and its count decides whether recovery may reach
// back to the node after `z`. Without the `a` there is one reading, the recovery is made, and its `head`
// reading wins, so the `rest` reduced after the `a` text must not be reused.

export default grammar({
    name: 'reuse_after_a_merge_raised_node_count',

    conflicts: $ => [[$.p, $.ai]],

    rules: {
        source: $ => seq(repeat($._prefix_item), $.rest),
        _prefix_item: $ => choice($.p, $.ai, $.bi, $.zi),
        p: $ => seq('a', repeat('b'), 'z'),
        ai: $ => seq('a', optional('r')),
        bi: $ => seq('b', optional('q')),
        zi: $ => seq('z', optional('s')),
        rest: $ => choice(seq($.head, repeat($._item)), repeat1($._item)),
        head: $ => seq('k', 'c', 'e', 'g', 'h', 'f'),
        _item: $ => choice($.x, $.y),
        x: $ => seq('m', $.par, optional(seq($.q, 'f'))),
        par: $ => seq('(', 'c'),
        q: $ => seq('e', $.r),
        r: $ => choice(seq('g', 'g'), 'h'),
        y: $ => seq('k', 'd'),
    },
});
