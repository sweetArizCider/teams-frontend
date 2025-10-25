import {
  type Team,
  type CreateTeamRequest,
  type UpdateTeamRequest,
  type GetAllTeamsResponse,
  type CreateTeamResponse,
  type UpdateTeamResponse,
  ApiEndpoints
} from '../../interfaces/server';

const BACKEND_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL;

interface CreateSingleTeamFunction {
  (_props: CreateTeamRequest): Promise<Team>;
}

interface RetrieveAllTeamsFunction {
  (): Promise<Team[]>;
}

interface UpdateSingleTeamFunction {
  (_teamId: string, _props: UpdateTeamRequest): Promise<Team>;
}

interface DeleteSingleTeamFunction {
  (_teamId: string): Promise<void>;
}

type FetchResponse = Response;

export const retrieveAllTeams: RetrieveAllTeamsFunction = async (): Promise<
  Team[]
> => {
  const response: FetchResponse = await fetch(
    `${BACKEND_URL}${ApiEndpoints.GET_ALL_TEAMS}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json: GetAllTeamsResponse = await response.json();
  return json.data;
};

export const createSingleTeam: CreateSingleTeamFunction = async (
  props: CreateTeamRequest
): Promise<Team> => {
  const response: FetchResponse = await fetch(
    `${BACKEND_URL}${ApiEndpoints.CREATE_TEAM}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(props)
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json: CreateTeamResponse = await response.json();
  return json.data;
};

export const updateSingleTeam: UpdateSingleTeamFunction = async (
  teamId: string,
  props: UpdateTeamRequest
): Promise<Team> => {
  const response: FetchResponse = await fetch(
    `${BACKEND_URL}${ApiEndpoints.UPDATE_TEAM.replace('{team_id}', teamId)}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(props)
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json: UpdateTeamResponse = await response.json();
  return json.data;
};

export const deleteSingleTeam: DeleteSingleTeamFunction = async (
  teamId: string
): Promise<void> => {
  const response: FetchResponse = await fetch(
    `${BACKEND_URL}${ApiEndpoints.DELETE_TEAM.replace('{team_id}', teamId)}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};
