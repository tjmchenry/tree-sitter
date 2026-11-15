#ifndef TREE_SITTER_PARSE_STACK_H_
#define TREE_SITTER_PARSE_STACK_H_

#ifdef __cplusplus
extern "C" {
#endif

#include "./array.h"
#include "./subtree.h"
#include <stdio.h>

typedef struct Stack Stack;

typedef uint32_t StackVersion;
#define STACK_VERSION_NONE ((StackVersion)-1)

typedef struct {
  SubtreeArray subtrees;
  StackVersion version;
} StackSlice;
typedef Array(StackSlice) StackSliceArray;

typedef struct {
  Length position;
  uint32_t depth;
  TSStateId state;
} StackSummaryEntry;
typedef Array(StackSummaryEntry) StackSummary;

// Create a stack.
Stack *ts_stack_new(SubtreePool *subtree_pool);

// Release the memory reserved for a given stack.
void ts_stack_delete(Stack *self);

// Get the stack's current number of versions.
uint32_t ts_stack_version_count(const Stack *self);

// Get the stack's current number of halted versions.
uint32_t ts_stack_halted_version_count(Stack *self);

// Get the state at the top of the given version of the stack. If the stack is
// empty, this returns the initial state, 1.
TSStateId ts_stack_state(const Stack *self, StackVersion version);

// Get the last external token associated with a given version of the stack.
Subtree ts_stack_last_external_token(const Stack *self, StackVersion version);

// Find the last external token in the subtrees on a given version of the stack.
Subtree ts_stack_find_last_external_token(const Stack *self, StackVersion version);

// Set the last external token associated with a given version of the stack.
void ts_stack_set_last_external_token(Stack *self, StackVersion version, Subtree token);

// Get the position of the given version of the stack within the document.
Length ts_stack_position(const Stack *, StackVersion);

// Get or set the state in which the next token of a version is lexed. It is the state on top of the
// stack, except after a node reused whole from an old tree, and after extras that follow one: there
// it is the state that node recorded.
TSStateId ts_stack_lex_state(const Stack *, StackVersion);
void ts_stack_set_lex_state(Stack *, StackVersion, TSStateId);

// Set it for the subtree just pushed onto a version, given what it was before the push: a node reused
// whole sets the state it recorded, and an extra keeps what was there.
void ts_stack_keep_lex_state(Stack *, StackVersion, TSStateId lex_state_below);

// Set it for the extras on top of a version to what it is below them.
void ts_stack_keep_lex_state_below_extras(Stack *, StackVersion);

// Whether a node reduced from the top of this version would depend on text before its start.
bool ts_stack_has_context(const Stack *, StackVersion);

// A pop that follows merged paths down to different stack nodes splits them into versions again.
// Which of those go on was decided by readings that had split off before the stack nodes between
// the node all the paths share and the top, so a node reduced from one of those later depends on
// them. Record that dependency for every stack node that only some of the versions of a pop's slices
// have.
void ts_stack_add_context_between(Stack *, const StackSliceArray *);

// Pop a given number of entries, like `ts_stack_pop_count`. With `marks`, record that dependency for
// each stack node that was popped past: the popping version has read the stack below it.
StackSliceArray ts_stack_pop_count_past(Stack *, StackVersion, uint32_t count, bool marks);

// Push a tree and state onto the given version of the stack.
//
// This transfers ownership of the tree to the Stack. Callers that
// need to retain ownership of the tree for their own purposes should
// first retain the tree.
void ts_stack_push(Stack *self, StackVersion version, Subtree subtree, bool pending, TSStateId state);

// Pop the given number of entries from the given version of the stack. This
// operation can increase the number of stack versions by revealing multiple
// versions which had previously been merged. It returns an array that
// specifies the index of each revealed version and the trees that were
// removed from that version.
StackSliceArray ts_stack_pop_count(Stack *self, StackVersion version, uint32_t count);

// Remove an error at the top of the given version of the stack.
SubtreeArray ts_stack_pop_error(Stack *self, StackVersion version);

// Remove any pending trees from the top of the given version of the stack.
StackSliceArray ts_stack_pop_pending(Stack *self, StackVersion version);

// Remove all trees from the given version of the stack.
StackSliceArray ts_stack_pop_all(Stack *self, StackVersion version);

// Get the maximum number of tree nodes reachable from this version of the stack
// since the last error was detected.
uint32_t ts_stack_node_count_since_error(const Stack *self, StackVersion version);

int32_t ts_stack_dynamic_precedence(Stack *self, StackVersion version);

bool ts_stack_has_advanced_since_error(const Stack *self, StackVersion version);

// Compute a summary of all the parse states near the top of the given
// version of the stack and store the summary for later retrieval.
void ts_stack_record_summary(Stack *self, StackVersion version, uint32_t max_depth);

// Retrieve a summary of all the parse states near the top of the
// given version of the stack.
StackSummary *ts_stack_get_summary(Stack *self, StackVersion version);

// Get the total cost of all errors on the given version of the stack.
uint32_t ts_stack_error_cost(const Stack *self, StackVersion version);

// Merge the given two stack versions if possible, returning true
// if they were successfully merged and false otherwise.
bool ts_stack_merge(Stack *self, StackVersion version1, StackVersion version2);

// Determine whether the given two stack versions can be merged.
bool ts_stack_can_merge(Stack *self, StackVersion version1, StackVersion version2);

Subtree ts_stack_resume(Stack *self, StackVersion version);

void ts_stack_pause(Stack *self, StackVersion version, Subtree lookahead);

void ts_stack_halt(Stack *self, StackVersion version);

bool ts_stack_is_active(const Stack *self, StackVersion version);

bool ts_stack_is_paused(const Stack *self, StackVersion version);

bool ts_stack_is_halted(const Stack *self, StackVersion version);

void ts_stack_renumber_version(Stack *self, StackVersion v1, StackVersion v2);

void ts_stack_swap_versions(Stack *, StackVersion v1, StackVersion v2);

StackVersion ts_stack_copy_version(Stack *self, StackVersion version);

// Remove the given version from the stack.
void ts_stack_remove_version(Stack *self, StackVersion version);

void ts_stack_clear(Stack *self);

bool ts_stack_print_dot_graph(Stack *self, const TSLanguage *language, FILE *f);

#ifdef __cplusplus
}
#endif

#endif  // TREE_SITTER_PARSE_STACK_H_
