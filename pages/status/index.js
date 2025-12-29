import useSWR from "swr";

async function fetchApi(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPages() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DataBaseStatus />
    </>
  );
}

function DataBaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
  });

  let databaseStatusInformation = "Carregando...";

  if (!isLoading && data) {
    databaseStatusInformation = (
      <>
        <h2>Database</h2>
        <div>
          Versão do banco de dados: {data.dependencies.database.version}
        </div>
        <div>
          Máximo números de conexão:{" "}
          {data.dependencies.database.max_connections}
        </div>
        <div>
          Conexões abertas: {data.dependencies.database.opened_connections}
        </div>
      </>
    );
  }

  return databaseStatusInformation;
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <>
      <div>Última atualização: {updatedAtText}</div>
    </>
  );
}
