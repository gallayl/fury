import {
  Typography,
  Card,
  CircularProgress,
  ListItemText,
  List,
  ListItem,
  LinearProgress
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { ServiceContext } from "../context/service-context";

export const humanFileSize = (bytes: number, si = false) => {
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }
  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return `${bytes.toFixed(1)} ${units[u]}`;
};

export interface SystemDetailsResponse {
  platform: string; //"win32";
  osType: string; // "Windows_NT";
  osRelease: string; // "10.0.18362";
  cpu: {
    manufacturer: string; // "Intel®";
    brand: string; // "Core™ i5-4590";
    vendor: string; //"GenuineIntel";
    family: string; //"6";
    model: string; //"60";
    stepping: string; // "3";
    revision: string; // "15363";
    voltage: string; //  "";
    speed: string; // "3.30";
    speedmin: string; //"";
    speedmax: string; //"3.30";
    cores: number; // 4;
    physicalCores: number; //4;
    processors: number; //1;
    socket: string; // "LGA1155";
    cache: { l1d: number; l1i: number; l2: number; l3: number };
  };
  mem: {
    active: number; // 15918424064
    available: number; // 18376224768
    buffcache: number; // 0
    free: number; // 18376224768
    swapfree: number; // 5097127936
    swaptotal: number; // 5100273664
    swapused: number; // 3145728
    total: number; // 34294648832
    used: number; //15918424064
  };
  diskLayout: Array<{
    bytesPerSector: number; // 512
    device: string; // ""
    firmwareRevision: string; // "MX6OACF0"
    interfaceType: string; // "SATA"
    name: string; // "TOSHIBA HDWD130"
    sectorsPerTrack: number; //63
    serialNum: string; // "Z74441BAS"
    size: number; // 3000590369280
    smartStatus: string; // "Ok"
    totalCylinders: number; // 364801
    totalHeads: number; // 255
    totalSectors: number; //5860528065
    totalTracks: number; //93024255
    tracksPerCylinder: number; //255
    type: string; //"HD"
    vendor: string; // "(Standard disk drives)"
  }>;
  fsSize: Array<{
    fs: string; // "C:";
    mount: string; // "C:";
    size: string; // "499461910528";
    type: string; // "NTFS";
    use: number; // 35.12599908300009;
    used: number; // 175440986112;
  }>;
  hostname: string; // "Behemoth-PC";
}

export const SystemDetails: React.FunctionComponent = () => {
  const service = useContext(ServiceContext);
  const [result, setResult] = useState<SystemDetailsResponse | undefined>();
  const [error, setError] = useState<string | undefined>();

  const [memValues, setMemValues] = useState({
    ramTotal: "",
    ramUsed: "",
    ramPercent: 0,
    swapTotal: "",
    swapUsed: "",
    swapPercent: 0
  });

  useEffect(() => {
    (async () => {
      /** */
      const response = await service.fetch(`/getSystemDetails`);
      if (response.ok) {
        const responseValue: SystemDetailsResponse = await response.json();
        setResult(responseValue);
        setMemValues({
          ramTotal: humanFileSize(responseValue.mem.total),
          ramUsed: humanFileSize(responseValue.mem.used),
          ramPercent: (responseValue.mem.used / responseValue.mem.total) * 100,
          swapTotal: humanFileSize(responseValue.mem.swaptotal),
          swapUsed: humanFileSize(responseValue.mem.swapused),
          swapPercent:
            (responseValue.mem.swapused / responseValue.mem.swaptotal) * 100
        });
      } else {
        setError("Error fetching system details.");
      }
    })();
  }, [service]);

  return (
    <Card
      style={{
        padding: "1em",
        margin: "1em",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Typography variant="h4" style={{ width: "100%" }}>
        System details
      </Typography>
      {!error && !result ? (
        <CircularProgress />
      ) : (
        <>
          {error ? <Typography color="error">{error}</Typography> : null}
          {result ? (
            <List style={{ width: "100%" }}>
              <ListItem>
                <ListItemText
                  primary={`${result.hostname}`}
                  secondary={`${result.osType} (${result.platform}) ${result.osRelease}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={`${result.cpu.manufacturer} ${result.cpu.brand} @ ${result.cpu.speed}`}
                  secondary={`${result.cpu.physicalCores} physical cores with ${result.cpu.cores} threads`}
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary={`${memValues.ramTotal} RAM, ${memValues.swapTotal} swap`}
                  secondary={
                    <>
                      <Typography>{`${memValues.ramTotal} RAM, ~${memValues.ramUsed} used`}</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={memValues.ramPercent}
                      />
                      <br />
                      <Typography>{`${memValues.swapTotal} swap, ~${memValues.swapUsed} used`}</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={memValues.swapPercent}
                      />
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={`${result.fsSize.length} file system volumes`}
                  secondary={
                    <>
                      {result.fsSize.map((fs, id) => (
                        <div key={id} style={{ marginBottom: "1em" }}>
                          <Typography>
                            {`${fs.fs || fs.mount} (${
                              fs.type
                            }) - ${humanFileSize(
                              parseInt(fs.size, 10)
                            )}, ${humanFileSize(fs.used)} used`}
                          </Typography>
                          <LinearProgress
                            value={fs.use}
                            variant="determinate"
                          />
                        </div>
                      ))}
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={`${result.diskLayout.length} physical HDD / SSD drives`}
                  secondary={
                    <>
                      {result.diskLayout.map((disk, id) => (
                        <Typography key={id}>
                          {disk.name} - {humanFileSize(disk.size)} {disk.type} -
                          Smart status:&nbsp;
                          <strong>{disk.smartStatus}</strong>
                        </Typography>
                      ))}
                    </>
                  }
                />
              </ListItem>
            </List>
          ) : null}
        </>
      )}
    </Card>
  );
};
