"use client";
import Image from "next/image";
import { useState } from "react";
interface country {
  country_id: string;
  probability: number;
}
interface user {
  name: string;
  age: number;
  gender: string;
  country: country[];
}
export default function Home() {
  const [name, setName] = useState("");
  const [data, setData] = useState<user[]>([]);
  const [loading, setLoading] = useState(false);
  const clearData = () => {
    setData([]);
    setName("");
  };
  const formHandler = async (event: any) => {
    event.preventDefault();
    if (name != "") getUserDetails(name);
  };

  async function getUserDetails(name: string) {
    // clearData();
    setLoading(true);
    const age = await fetch(`https://api.agify.io?name=${name}`, {
      cache: "no-store",
    });
    const gender = await fetch(`https://api.genderize.io?name=${name}`, {
      cache: "no-store",
    });
    const nationality = await fetch(`https://api.nationalize.io?name=${name}`, {
      cache: "no-store",
    });
    // var data: any = [];
    Promise.all([age, gender, nationality])
      .then(async ([age, gender, nationality]) => {
        const a = await age.json();
        const b = await gender.json();
        const c = await nationality.json();
        return [a, b, c];
      })
      .then((data: user[]) => {
        setLoading(false);
        if (data[0].age != null) setData(data);
        else {
          clearData();
          alert(`details not fount for user ${name}`);
        }
      })
      .catch((e) => {
        setLoading(false);

        console.log(e);
      });
  }
  return (
    <main>
      <form onSubmit={formHandler}>
        <h3>Get the user details by just entering name</h3>
        <input
          type="text"
          style={{ color: "black" }}
          placeholder="Enter Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value), console.log("e.", name, e.target.value);
          }}
        />
        <br />
        <button
          type="submit"
          disabled={loading}
          style={{ border: "1px solid", margin: "2rem", padding: "0.5rem" }}
        >
          submit
        </button>
        <button
          disabled={loading}
          style={{ border: "1px solid", margin: "2rem", padding: "0.5rem" }}
          onClick={clearData}
        >
          clear
        </button>

        {data.length > 0 ? (
          <>
            <p>Details of user {name}</p>
            <table>
              <tr>
                <th>name</th>
                <th>age</th>
                <th>gender</th>
                <th>nationality</th>
              </tr>
              {/* {data.map((row) => ( */}
              <tr>
                <td>{data[0].name}</td>
                <td>{data[0].age}</td>
                <td>{data[1].gender}</td>
                <td>
                  <table>
                    <tr>
                      <th>county</th>
                      <th>probability</th>
                    </tr>
                    {data[2].country.map((row) => (
                      <tr key={row.country_id}>
                        <td>{row.country_id}</td>
                        <td>{row.probability}</td>
                      </tr>
                    ))}
                  </table>
                </td>
              </tr>
            </table>
          </>
        ) : (
          <></>
        )}
      </form>
    </main>
  );
}
