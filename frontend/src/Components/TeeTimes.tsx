import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import Cookies from "js-cookie";

import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Courier New", Courier, monospace;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;

const StyledLi = styled.li`
  list-style-type: none;
  border: 1px solid black;
  width: 400px;
  margin-bottom: 0.25rem;
  padding: 2px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const StyledInput = styled.input`
  margin-left: 1rem;
  margin-right: 1rem;
`;

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledP = styled.p`
  font-size: 1.5rem;
  margin-top: 1rem;
`;

const LINK = styled(Link)`
  color: blue;
`;

interface TeeTimesProps {
  value: boolean;
}

function TeeTimes({ value }: TeeTimesProps) {
  interface MyObject {
    id: number;
    times_string: string;
    open_slots: number;
  }

  //hantera bokningar
  async function bookTime(id: number) {
    const token: string | undefined = Cookies.get("token");

    const response = await fetch("/book-tee-time", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, id }),
    });

    console.log(response.status);
  }

  //hämta och visa användarens bokade tider
  const [bookedTimes, setBookedTimes] = useState<MyObject[]>([]);

  const [noBookings, setNoBookings] = useState<boolean>(false);

  async function fetchBookedTimes() {
    const token: string | undefined = Cookies.get("token");

    const response = await fetch("/booked-times", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    const result: MyObject[] = await response.json();

    const sortedBookings: MyObject[] = result.sort((a, b) => a.id - b.id);

    if (sortedBookings.length === 0) {
      setNoBookings(true);
    } else {
      setNoBookings(false);
    }

    setBookedTimes(sortedBookings);
  }
  //hantera avboknignar
  async function cancelTime(teeTimeId: number) {
    const token: string | undefined = Cookies.get("token");

    await fetch("/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, teeTimeId }),
    });
  }

  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  function isLoggedIn() {
    const token: string | undefined = Cookies.get("token");
    console.log("token" + token);

    if (token && token != "") {
      setLoggedIn(true);
    }
  }

  useEffect(() => {
    fetchBookedTimes();
    isLoggedIn();
    getDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [dates, setDates] = useState<string[]>([]);

  async function getDates() {
    const response = await fetch("/dates");
    const jsonData: string[] = await response.json();

    setDates(jsonData);
  }

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  interface MyTeeTimes {
    id: number;
    times_string: string;
    open_slots: number;
  }

  const [fetchedTimes, setFetchedTimes] = useState<MyTeeTimes[] | null>(null);

  const fetchTimes = async (date: string | null) => {
    const response = await fetch("/times-by-date", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date: date }),
    });
    const result: MyTeeTimes[] = await response.json();
    setFetchedTimes(result);
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(event.target.value);
    fetchTimes(event.target.value);
  };

  return (
    <>
      <StyledDiv>
        {loggedIn && (
          <Container>
            {noBookings ? (
              <h3>Du har inga bokade tider</h3>
            ) : (
              <h3>Dina bokade tider</h3>
            )}
            {bookedTimes && (
              <ul>
                {bookedTimes.map((array) => (
                  <StyledLi key={array.id}>
                    {array.times_string}
                    <StyledInput
                      type="button"
                      value="Avboka"
                      onClick={async () => {
                        await cancelTime(array.id);
                        fetchBookedTimes();
                        fetchTimes(selectedDate);
                      }}
                    />
                    <p>{array.open_slots} platser kvar.</p>
                  </StyledLi>
                ))}
              </ul>
            )}
          </Container>
        )}

        {value && (
          <Container>
            {!loggedIn && (
              <StyledP>Du måste vara inloggad för att boka en tid.</StyledP>
            )}
            {!loggedIn ? (
              <LINK to="/account/login">
                <StyledP>Logga in</StyledP>
              </LINK>
            ) : (
              <h3>Boka tid</h3>
            )}
            {loggedIn && (
              <div>
                <p>Välj en dag för att boka tid.</p>

                {dates && (
                  <div>
                    <select value={selectedDate || ""} onChange={handleChange}>
                      <option value="" disabled>
                        Välj ett datum
                      </option>
                      {dates.map((date) => (
                        <option key={date} value={date}>
                          {date}
                        </option>
                      ))}
                    </select>
                    {fetchedTimes && (
                      <ul>
                        {fetchedTimes.map((array) => (
                          <StyledLi key={array.id}>
                            {array.times_string}
                            <StyledInput
                              type="button"
                              value="Boka"
                              onClick={async () => {
                                await bookTime(array.id);
                                fetchBookedTimes();
                                fetchTimes(selectedDate);
                              }}
                            />
                            <p>{array.open_slots} platser kvar.</p>
                          </StyledLi>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}
          </Container>
        )}
      </StyledDiv>
    </>
  );
}

export default TeeTimes;
