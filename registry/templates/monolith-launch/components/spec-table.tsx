import { specs } from "../data/product"

import { Reveal } from "./reveal"

type Group = (typeof specs)[number]

/**
 * The specification table: one full-bleed hairline band per group, with the group
 * name in the left column and the rows in the right.
 *
 * It is a `<dl>`, so a screen reader gets the term/value pairing for free — the
 * thing a grid of `<div>`s throws away. Takes the groups as a prop so the home
 * page can show two and the specifications page all of them.
 */
export function SpecTable({ groups }: { groups: readonly Group[] }) {
  return (
    <>
      {groups.map((group, index) => (
        <Reveal key={group.group} className="monoSpecGroup" delay={index * 70}>
          <div className="monoWrap monoSpecGroupInner">
            <h3 className="monoLabel">{group.group}</h3>
            <dl className="monoSpecRows">
              {group.rows.map(([term, value]) => (
                <div key={term} className="monoSpecRow">
                  <dt>{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      ))}
    </>
  )
}
