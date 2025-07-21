import { IContractSummaryData } from "@/interface/contractSummary/contractSummary";
import moment from "moment";

export const Salary = ({
  contractDetails,
  currency,
  isUpdate,
}: {
  contractDetails?: IContractSummaryData;
  currency?: string;
  isUpdate?: boolean;
}) => {
  // const bonusData: [] =
  //   contractDetails?.employeeDetail?.customBonus &&
  //   JSON.parse(contractDetails?.employeeDetail?.customBonus)?.data;

  const monthlySalary = contractDetails?.employeeDetail?.employeeSalary
    .filter((obj) => {
      const objStartDate = moment(obj.startDate);
      const objEndDate = moment(
        obj.endDate ??
          moment(moment().format("DD-MM-YYYY"), "DD-MM-YYYY").toDate()
      );
      return (
        objStartDate.isBetween(
          contractDetails.startDate,
          contractDetails.endDate,
          null,
          "[]"
        ) ||
        objEndDate.isBetween(
          contractDetails.startDate,
          contractDetails.endDate,
          null,
          "[]"
        )
      );
    })
    .sort((a, b) => moment(b.startDate).diff(moment(a.startDate)));
  const latestData = monthlySalary && monthlySalary[0];

  const empBonusData = contractDetails?.employeeDetail?.employeeBonus
    ?.filter((obj) => {
      const objStartDate = moment(obj.startDate);
      const objEndDate = moment(
        obj.endDate ??
          moment(moment().format("DD-MM-YYYY"), "DD-MM-YYYY").toDate()
      );
      return (
        objStartDate.isBetween(
          contractDetails.startDate,
          contractDetails.endDate,
          null,
          "[]"
        ) ||
        objEndDate.isBetween(
          contractDetails.startDate,
          contractDetails.endDate,
          null,
          "[]"
        )
      );
    })
    .sort((a, b) => moment(b.startDate).diff(moment(a.startDate)));

  const seenBonusIds = new Set();
  const latestBonusData = empBonusData?.filter(
    (obj) =>
      obj.endDate === null &&
      !seenBonusIds.has(obj.bonusId) &&
      seenBonusIds.add(obj.bonusId)
  );
  return (
    <>
      <div className="bg-white font-sans">
        <div className="content text-black font-normal">
          <div className="subject mb-5">
            <p className="text-base text-center font-bold uppercase italic">
              CONTRAT DE TRAVAIL A DUREE DETERMINEE <br /> N° CW2972991 /{" "}
              {/* {isUpdate
                ? moment(contractDetails?.startDate).format("YYYY")
                : "2021"} */}
              2021-
              {isUpdate
                ? contractDetails?.newContractNumber
                : "[CONTRACT-NUMBER]"}
            </p>
          </div>
          <div className="[&>*]:mb-3 [&>*:last-child]:mb-0 [&>*]:text-xs">
            <p>Entre les soussignés :</p>
            <p>
              <strong>LRED</strong>, dont le siège social est 18, Rue Hadj Ahmed
              Mohamed Hydra, Alger 16000 Algérie, représentée par{" "}
              <strong>Dr. HANNACHI NIHAD</strong>, agissant en qualité de:
              Gérante
            </p>
            <p>
              À l&apos;effet du présent contrat, ci-après désigné «
              l&apos;employeur »
            </p>
            <p>
              <strong>D'une part,</strong>
            </p>
            <p className="text-right">
              <strong>ET</strong>
            </p>

            <ul className="max-w-[95%] mx-auto">
              <li className="flex mb-2 text-xs">
                <span className="inline-block w-[180px]">
                  <strong>Monsieur (Nom & Prénom):</strong>
                </span>
                <span className="inline-block max-w-[calc(100%_-_180px)]">
                  <strong>
                    {" "}
                    {isUpdate
                      ? contractDetails?.employeeDetail?.loginUserData
                          ?.lastName +
                        " " +
                        contractDetails?.employeeDetail?.loginUserData
                          ?.firstName
                      : "[LAST-NAME] [FIRST-NAME]"}
                  </strong>
                </span>
              </li>
              {isUpdate &&
              (contractDetails?.employeeDetail?.loginUserData?.birthDate ||
                contractDetails?.employeeDetail?.loginUserData
                  ?.placeOfBirth) ? (
                <li className="flex mb-2 text-xs">
                  <span className="inline-block w-[180px]">
                    <strong>Né(e) le:</strong>
                  </span>
                  <span className="inline-block max-w-[calc(100%_-_180px)]">
                    <strong>
                      {moment(
                        contractDetails?.employeeDetail?.loginUserData
                          ?.birthDate
                      )
                        .locale("fr")
                        .format("DD MMMM YYYY") ?? ""}{" "}
                      à{" "}
                      {contractDetails?.employeeDetail?.loginUserData
                        ?.placeOfBirth ?? ""}
                    </strong>
                  </span>
                </li>
              ) : (
                <li className="flex mb-2 text-xs">
                  <span className="inline-block w-[180px]">
                    <strong>Né(e) le:</strong>
                  </span>
                  <span className="inline-block max-w-[calc(100%_-_180px)]">
                    <strong>[DOB] à [PLACE-OF-BIRTH]</strong>
                  </span>
                </li>
              )}
              {isUpdate && contractDetails?.employeeDetail?.address ? (
                <li className="flex mb-2 text-xs">
                  <span className="inline-block w-[180px]">
                    <strong>Demeurant à:</strong>
                  </span>
                  <span className="inline-block max-w-[calc(100%_-_180px)]">
                    <strong>{contractDetails?.employeeDetail?.address}</strong>
                  </span>
                </li>
              ) : (
                <li className="flex mb-2 text-xs">
                  <span className="inline-block w-[180px]">
                    <strong>Demeurant à:</strong>
                  </span>
                  <span className="inline-block max-w-[calc(100%_-_180px)]">
                    <strong>[ADDRESS]</strong>
                  </span>
                </li>
              )}
            </ul>

            <p>Ci-après désigné « le Salarié »,</p>
            <p>
              <strong>D&apos;autre part</strong>
            </p>
            <p>
              <strong>Il a été convenu et arrêté ce qui suit :</strong>
            </p>

            <div className="mt-6 [&>*]:mb-2">
              <p className="underline">
                <strong>Article 01 : Texte de Référence</strong>
              </p>
              <p>
                La relation de travail entre les parties, faisant l&apos;objet
                du présent contrat, est régie par Les dispositions législatives
                et réglementaires de la République Algérienne Démocratique et
                Populaire en vigueur, notamment: La Loi n° 90-11 du 21.04.1990
                relative aux relations de travail, modifiée et complétée par la
                Loi n° 91-29 du 21.12.1991, et en particulier par les
                dispositions de son article 12 alinéa 1,2,3 & 4 et modifiée &
                complétée par l&apos;ordonnance N° 96-21 du 09/07/1996 relative
                & complémentaire à la Loi 90-11 qui autorisent le contrat à
                durée déterminée, l&apos;ordonnance N° 03/97 du 11/01/ 1997
                relative à la durée légale de travail, Et enfin le règlement
                intérieur de l&apos;entreprise et aux procédures internes en
                vigueur.
              </p>
              <p>
                Comme si l&apos;activité de l&apos;entreprise est liée à
                l&apos;industrie des hydrocarbures et essentiellement au contrat
                avec notre client{" "}
                <strong>
                  Services Pétroliers Schlumberger et Compagnie
                  d&apos;Operations Pétrolières Schlumberger.
                </strong>
              </p>
              <p>
                Le présent contrat est lié directement et automatiquement à la
                relation de la LRED avec la société de Schlumberger par contrat
                n°. <strong>CW2972991</strong>
              </p>
            </div>

            <div className="mt-6 [&>*]:mb-2">
              <p className="underline">
                <strong>Article 02 : Objet du contrat</strong>
              </p>
              <p>
                Le présent contrat de travail établi à l&apos;effet de fixer les
                conditions de la relation de travail du salarié ainsi que les
                droits et les obligations afférents à chaque partie en
                complémentarité de celles édictées par la législation du travail
                & du règlement intérieur de l&apos;employeur.
              </p>
            </div>

            <div className="mt-6 [&>*]:mb-2">
              <p className="underline">
                <strong>
                  Article 03 : Poste de travail et lieu d&apos;affectation
                </strong>
              </p>
              <p>
                Le Salarié qui déclare être libre de tout engagement
                professionnel autre que par les présentes est recruté par
                l&apos;employeur en qualité de:&nbsp;
                <strong>
                  {isUpdate
                    ? contractDetails?.employeeDetail?.fonction
                    : "[fonction]"}
                </strong>
              </p>
              <p>
                Le salarié déclare par ailleurs consentir à toutes autres ré
                affectations professionnelles et géographiques décidées par
                l&apos;employeur par nécessité de service.
              </p>
            </div>

            <div className="mt-6 [&>*]:mb-2">
              <p className="underline">
                <strong>Article 04 : Motif du contrat</strong>
              </p>
              <p>
                Le présent contrat est conclu pour une durée déterminée à
                l&apos;égard du travail temporaire pour lequel le salarié est
                recruté; l&apos;employeur étant lié à des contrats de
                prestations non renouvelables.
              </p>
            </div>

            <div className="mt-6 [&>*]:mb-2">
              <p className="underline">
                <strong>Article 05 : Classification</strong>
              </p>
              <p>
                Le salarié recruté pour le poste su-indiqué percevra une
                rémunération comme suit :
              </p>
              <ul className="pl-10 list-outside list-disc">
                <li>
                  Salaire mensuel net de :{" "}
                  {/* {isUpdate
                    ? `${
                        contractDetails?.employeeDetail?.employeeSalary[0]?.monthlySalary.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        ) ?? 0
                      } ${currency ?? ""}`
                    : "[MONTHLY-SALARY]"} */}
                  {isUpdate
                    ? `${
                        latestData?.monthlySalary?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) ?? 0
                      } ${currency ?? ""}`
                    : "[MONTHLY-SALARY]"}
                  {/* {contractDetails?.employeeDetail?.monthlySalary ?? 0}DZD */}
                </li>

                {isUpdate ? (
                  latestBonusData &&
                  latestBonusData?.length > 0 && (
                    <>
                      {latestBonusData?.map(
                        (e: {
                          bonus: {
                            id: number;
                            name: string;
                            code: string;
                          };
                          code: string;
                          id: number;
                          name: string;
                          bonusId: number;
                          catalogueNumber: string;
                          coutJournalier: number;
                          employeeId: number;
                          endDate: string;
                          price: number;
                          startDate: string;
                        }) => (
                          <li key={e.id}>
                            {`${e?.bonus?.name} Bonus de :
          ${e?.price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          ${currency ?? ""} par jour de présence sur chantier (
          ${e?.bonus?.code})`}
                          </li>
                        )
                      )}
                      <li>
                        Les bonus sont approuvés par le supérieur hiérarchique
                      </li>
                      <li>Les bonus sont payés chaque trois mois</li>
                    </>
                  )
                ) : (
                  <>
                    <li>
                      [BONUS-NAME] Bonus de : [BONUS-VALUE] par jour de présence
                      sur chantier ([BONUS-NAME])
                    </li>
                    <li>
                      [HAS-BONUS]Les bonus sont approuvés par le supérieur
                      hiérarchique
                    </li>
                    <li>[HAS-BONUS]Les bonus sont payés chaque trois mois</li>
                  </>
                )}
              </ul>
              <p>
                Y compris toutes les indemnités, les primes et les retenues
                légales liées à cette position. Le décompte de la paie est opéré
                sur la base de l&apos;état de pointage établi par le Supérieur
                hiérarchique.
              </p>
            </div>
            <div className="mt-6 [&>*]:mb-2">
              <p className="underline">
                <strong>Article 06 : Durée du Contrat </strong>
              </p>
              <p>
                Le présent contrat est conclu pour une durée déterminée de: (
                {isUpdate
                  ? moment(contractDetails?.endDate)
                      .add(1, "month")
                      .diff(moment(contractDetails?.startDate), "months")
                      .toString()
                      .padStart(2, "0")
                  : "[DURATION]"}
                ) mois à Compter du{" "}
                {isUpdate
                  ? moment(contractDetails?.startDate)
                      .locale("fr")
                      .format("DD MMMM YYYY")
                  : "[START-DATE]"}{" "}
                au{" "}
                {isUpdate
                  ? moment(contractDetails?.endDate)
                      .locale("fr")
                      .format("DD MMMM YYYY")
                  : "[END-DATE]"}{" "}
                <br />
                Le présent contrat prend fin le :{" "}
                {isUpdate
                  ? moment(contractDetails?.endDate)
                      .locale("fr")
                      .format("DD MMMM YYYY")
                  : "[END-DATE]"}
              </p>
              <p>
                Dans le cas où les travaux ne sont pas terminés dans les délais
                impartis, la durée du contrat peut être prorogée par les deux
                parties par un simple « Avenant » et ce dans les mêmes
                conditions stipulées dans ce contrat.
              </p>
              <p>
                A la fin de la date sus indiquée, la relation de travail liant
                les deux (02) parties est rompue sans qu&apos;il soit utile de
                notifier un préavis.
              </p>
              <p>
                Le présent contrat ne peut être en aucun cas reconduit
                tacitement.
              </p>
              <p>
                Vu les dispositions de l'article 12 de la loi 90_11 ordonnances
                n 96_21du 09 juillet 1996
              </p>
            </div>
            <div className="mt-6 [&>*]:mb-2">
              <p className="underline">
                <strong>Article 07 : Période d&apos;essai</strong>
              </p>
              <p>
                Le salarié est soumis à une période d&apos;essai de (03) Mois.
                Durant cette période d&apos;essai, le présent contrat peut être
                résilié à tout moment à l&apos;initiative de chaque partie sans
                indemnité ni préavis.
              </p>
              <p>
                Le travailleur nouvellement recrute peut être soumis à une
                période d&apos;essai dont la durée ne peut excéder trois (03)
                mois.
              </p>
              <p>
                Au-delà de cette période le préavis est de : Un (01) mois
                maximum, en cas de démission du salarié.
              </p>
              <p>
                Si l'employé quitte dans les 30 jours suivant la signature du
                contrat, LRED déduira toutes les charges raisonnables de toutes
                les sommes dues pour le temps nécessaire à l&apos;embauche de la
                personne, ce qui inclura le coût des visites médicales
                d&apos;embauche effectuées. Si des efforts supplémentaires
                étaient entrepris au cours de ce processus, LRED en déduirait un
                montant raisonnable, proportionnel au niveau d&apos;effort
                requis.
              </p>
            </div>
            <div className="mt-6 [&>*]:mb-2">
              <p className="underline">
                <strong>Article 08 : Horaire de travail </strong>
              </p>
              <p>
                L&apos;horaire de travail est celui en vigueur sur le lieu
                d&apos;affectation, le volume de travail hebdomadaire est fixé
                par la loi.
              </p>
              <p>
                En cas de nécessité de service, le salarié est astreint à
                exécuter des heures supplémentaires conformément à la loi.
              </p>
              <p>
                En cas de baisse de volume de travail indépendamment de la
                volonté de l&apos;employeur, celui-ci peut recourir au travail à
                temps partiel dans la limite de la moitié de la durée légale de
                travail. Dans ce cas et après notification le salarié perçoit
                une rémunération proportionnelle au volume de travail pratiqué.
              </p>
            </div>
            <div className="mt-6 [&>*]:mb-2">
              <p className="underline">
                <strong>Article 09 : Régime de travail</strong>
              </p>
              <p>
                Votre régime de travail s&apos;effectuera suivant le système dit
                de rotation sur le rythme de{" "}
                {isUpdate
                  ? contractDetails?.employeeDetail?.rotation?.weekOn
                  : "[WEEK-ON]"}{" "}
                semaines de travail suivi de{" "}
                {isUpdate
                  ? contractDetails?.employeeDetail?.rotation?.weekOff
                  : "[WEEK-OFF]"}{" "}
                semaines de congé de récupération à votre domicile. Celui-ci
                couvrant la part afférente des congés annuels et des jours
                ferries légaux. Le cycle de travail est fixé compte tenu des
                nécessités de service et de conditions imposées par les clients.
                Les absences pour cause de maladie, doivent être justifiées par
                le dépôt ou l'envoi (cachet de la poste faisant foi) dans les 48
                heures qui suivent, du certificat médical original.
              </p>
              <p>
                A défaut l'employé sera considéré en absence non justifiée,
                susceptible d'entrainer la rupture du contrat de travail.
              </p>
            </div>
            <div className="mt-6 [&>*]:mb-2">
              <p className="underline">
                <strong>Article 10 : Résiliation de Plein droit</strong>
              </p>
              <p>
                Le présent Contrat de travail entre le salarié & la LRED est
                résilié dans les cas suivants :
              </p>
              <ul>
                <li>
                  Tout refus d'affectation sera considéré comme un abandon de
                  poste et entrainera la rupture immédiate du présent contrat de
                  travail sans préavis ni indemnité.
                </li>
                <li>
                  Tout faux document ; fausse déclaration, ainsi que tout moyen
                  frauduleux ou Manœuvre frauduleuse, fournis ou utilisés par
                  l'employé afin de se faire recruter, découverts même après sa
                  prise de fonction, entrainera la résiliation immédiate du
                  contrat de travail, sans préavis ni indemnités.
                </li>
                <li>
                  Faute Professionnelle Grave Conformément au Règlement
                  intérieur de l&apos;entreprise.
                </li>
                <li>
                  Rupture intempestive ou imprévisible du contrat entre LRED &
                  le Client{" "}
                  {isUpdate
                    ? contractDetails?.employeeDetail?.client?.loginUserData
                        ?.name
                    : "(Schlumberger)"}
                  .
                </li>
                <li>Cas de force majeure.</li>
                <li>
                  A la demande du Superviseur ou Supérieur hiérarchique du lieu
                  d&apos;affectation.
                </li>
                <li>
                  A la demande et la recommandation du client{" "}
                  {isUpdate
                    ? contractDetails?.employeeDetail?.client?.loginUserData
                        ?.name
                    : "Schlumberger"}
                  .
                </li>
              </ul>
            </div>
            <div className="mt-6 [&>*]:mb-2">
              <p className="underline">
                <strong>Article 11 : Litige</strong>
              </p>
              <p>
                Tout litige pouvant surgir à l'occasion de l&apos;interprétation
                et/ou de l'exécution du présent contrat du travail devra faire
                l&apos;objet d'une tentative de règlement amiable entre les deux
                parties
              </p>
              <p>
                Dans le cas où cette procédure préalable n'aboutit pas, le
                litige sera soumis à l&apos;arbitrage du tribunal de Bir Mourad
                Rais, Alger.
              </p>
            </div>
            <div className="mt-6 [&>*]:mb-2">
              <p className="underline">
                <strong>Article 12 : Modifications</strong>
              </p>
              <p>
                Toute modification apportée au présent contrat ne pourra se
                faire qu&apos;avec l&apos;accord des deux parties et devra faire
                l&apos;objet d&apos;un avenant écrit.
              </p>
            </div>
            <div className="mt-6 [&>*]:mb-2">
              <p className="underline">
                <strong>Article 13 : Formalités finales.</strong>
              </p>
              <p>
                Le présent contrat sera signé par le salarié qui ajoutera la
                mention «Lu et approuvé » concomitamment à la signature de
                l&apos;employeur.
              </p>
            </div>

            <p className="text-right">
              <strong>Alger, le :</strong>
            </p>

            <ul>
              <li className="flex justify-between mb-5 last:mb-0">
                <span className="inline-block w-1/2">
                  <strong>Le salarié</strong>
                </span>
                <span className="inline-block w-1/2">
                  <strong>L&apos;employeur</strong>
                </span>
              </li>
              <li className="flex justify-between mb-5 last:mb-0">
                <span className="inline-block w-1/2">
                  <strong>
                    {isUpdate
                      ? contractDetails?.employeeDetail?.loginUserData
                          ?.lastName +
                        " " +
                        contractDetails?.employeeDetail?.loginUserData
                          ?.firstName
                      : "[LAST-NAME] [FIRST-NAME]"}
                  </strong>
                </span>
                <span className="inline-block w-1/2">
                  <strong>
                    TRIKI ACHOUR <br /> HR Manager LRED
                  </strong>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* <div className="mt-2 w-full">
      <div
        className="view ql-editor text-10px leading-normal font-medium text-black"
        dangerouslySetInnerHTML={{ __html: data ?? '' }}
      />
    </div>

    <div className="w-full">
      <img
        alt="seal"
        className="w-24 h-24 mb-4 border border-white"
        src={`./assets/images/blue-stamp-with-sign.jpg`}
      />
    </div>

    <div className="sdsdsd text-center w-full">
      <p className="text-10px leading-normal font-medium text-black mb-1 last:mb-0">
        SARL LRED Algerie RC n. 16/00-0125267B15
        <br /> NIF: 001530012526756
      </p>
    </div> */}
    </>
  );
};
