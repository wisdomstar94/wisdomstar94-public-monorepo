import { useId } from "react";

export function UseIdPageContent() {
  const id1 = useId();
  const id2 = useId();
  const id3 = useId();
  const id4 = useId();
  const id5 = useId();
  console.log('@id1', id1);
  console.log('@id2', id2);
  console.log('@id3', id3);
  console.log('@id4', id4);
  console.log('@id5', id5);
  return (
    <table>
      <thead>
        <tr>
          <th>
            var
          </th>
          <th>
            value
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            id1
          </td>
          <td>
            {id1}
          </td>
        </tr>
        <tr>
          <td>
            id2
          </td>
          <td>
            {id2}
          </td>
        </tr>
        <tr>
          <td>
            id3
          </td>
          <td>
            {id3}
          </td>
        </tr>
        <tr>
          <td>
            id4
          </td>
          <td>
            {id4}
          </td>
        </tr>
        <tr>
          <td>
            id5
          </td>
          <td>
            {id5}
          </td>
        </tr>
      </tbody>
    </table>
  );
}